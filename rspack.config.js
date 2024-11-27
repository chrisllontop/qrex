const path = require("node:path");
const { codecovWebpackPlugin } = require("@codecov/webpack-plugin");

const babelConfig = {
  babelrc: false,
  presets: ["@babel/preset-typescript", ["@babel/preset-env", { targets: "defaults, IE >= 10, Safari >= 5.1" }]],
};

module.exports = [
  {
    entry: "./src/index.ts",
    plugins: [
      codecovWebpackPlugin({
        enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
        bundleName: "qrex",
        uploadToken: process.env.CODECOV_TOKEN,
      }),
    ],
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
    target: "node",
  },
  {
    entry: "./src/browser.ts",
    plugins: [
      codecovWebpackPlugin({
        enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
        bundleName: "qrex",
        uploadToken: process.env.CODECOV_TOKEN,
      }),
    ],
    output: {
      path: path.resolve(__dirname, "dist/cjs"),
      filename: "qrex.browser.js",
      iife: true,
    },
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
    target: "node",
  },
];
