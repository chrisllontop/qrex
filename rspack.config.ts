import path from "node:path";
import { defineConfig } from "@rspack/cli";

const babelConfig = {
  babelrc: false,
  presets: ["@babel/preset-typescript", ["@babel/preset-env", { targets: "defaults, IE >= 10, Safari >= 5.1" }]],
};

const generateConfig = (name: string) => {
  return defineConfig({
    devtool: false,
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
      path: path.resolve(process.cwd(), "dist"),
      filename: `${name}.js`,
      library: {
        type: "module",
      },
    },
    experiments: {
      outputModule: true,
    },
    target: "web",
    externals: {
      "node:fs": "commonjs fs",
      pngjs: "commonjs pngjs",
    },
  });
};

const config = [generateConfig("qrex"), generateConfig("qrex.browser")];

export default config;
