import path from "node:path";
import { codecovWebpackPlugin } from "@codecov/webpack-plugin";
import { defineConfig } from "@rspack/cli";

const babelConfig = {
  babelrc: false,
  presets: ["@babel/preset-typescript", ["@babel/preset-env", { targets: "defaults, IE >= 10, Safari >= 5.1" }]],
};

const generateConfig = (name: string, type: "commonjs" | "module") => {
  const folder = type === "commonjs" ? "cjs" : "esm";
  const target = type === "commonjs" ? "node" : "web";
  const libraryType = type === "commonjs" ? "commonjs2" : "module";

  return defineConfig({
    plugins: [
      codecovWebpackPlugin({
        enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
        bundleName: `${name}-${folder}`,
        uploadToken: process.env.CODECOV_TOKEN,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: babelConfig,
          },
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    entry: `./src/${name}.ts`,
    output: {
      path: path.resolve(process.cwd(), `dist/${folder}`),
      filename: `${name}.js`,
      library: {
        type: libraryType,
      },
    },
    experiments: {
      outputModule: type === "module",
    },
    target,
    externals: {
      "node:fs": "commonjs fs",
      pngjs: "commonjs pngjs",
    },
  });
};

const config = [
  generateConfig("qrex", "commonjs"),
  generateConfig("qrex.browser", "commonjs"),
  generateConfig("qrex", "module"),
  generateConfig("qrex.browser", "module"),
];

export default config;
