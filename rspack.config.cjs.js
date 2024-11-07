const path = require("node:path");
// @ts-ignore
const TerserPlugin = require("terser-webpack-plugin");

const babelConfig = {
  babelrc: false,
  presets: [
    ["@babel/preset-env", { targets: "defaults, IE >= 10, Safari >= 5.1" }],
  ],
};

const outputPath = path.resolve(__dirname, "dist/cjs");

module.exports = [
  {
    entry: "./lib/index.js",
    output: {
      path: outputPath,
      filename: "qrex.js",
      library: {
        type: "commonjs2",
        name: "qrex",
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: babelConfig,
          },
        },
      ],
    },
    resolve: {
      extensions: [".js", ".json"],
    },
    target: "node",
  },
  {
    entry: "./lib/browser.js",
    output: {
      path: outputPath,
      filename: "qrex.browser.js",
      library: {
        type: "commonjs2",
        name: "qrex",
      },
      iife: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: babelConfig,
          },
        },
      ],
    },
    resolve: {
      extensions: [".js", ".json"],
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
    target: "node",
  },
];
