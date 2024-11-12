const path = require("node:path");
const TerserPlugin = require("terser-webpack-plugin");

const babelConfig = {
  babelrc: false,
  presets: [
    ["@babel/preset-env", { targets: "defaults, IE >= 10, Safari >= 5.1" }],
  ],
};

module.exports = [
  {
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist/cjs"),
      filename: "qrex.js",
      library: {
        type: "commonjs2",
        name: "QRCode",
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
      extensions: [".js", ".ts"],
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
    target: "node",
  },
  {
    entry: "./src/browser.js",
    output: {
      path: path.resolve(__dirname, "dist/cjs"),
      filename: "qrex.browser.js",
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
      extensions: [".js", ".ts"],
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
    target: "node",
  },
];
