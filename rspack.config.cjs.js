const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

const babelConfig = {
  babelrc: false,
  presets: [
    ["@babel/preset-env", { targets: "defaults, IE >= 10, Safari >= 5.1" }],
  ],
};

module.exports = [
  {
    entry: "./lib/browser.js", // Adjusted entry file
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "qrcode.cjs.js",
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
      extensions: [".js", ".json"],
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
    target: "node",
  },
  {
    entry: "./helper/to-sjis-browser.js",
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "qrcode.tosjis.cjs.js",
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
