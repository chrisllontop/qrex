import path from "node:path";
import { defineConfig } from "@rspack/cli";

const generateConfig = (name: string) => {
  return defineConfig({
    devtool: false,
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
              },
            },
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
    target: ["web", "es2015"],
    optimization: {
      minimize: true,
    },
    externals: {
      "node:fs": "commonjs fs",
      pngjs: "commonjs pngjs",
    },
  });
};

const config = [generateConfig("qrex"), generateConfig("qrex.browser")];

export default config;
