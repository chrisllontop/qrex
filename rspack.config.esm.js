const path = require("path");
const babelConfig = {
  babelrc: false,
  presets: [
    ["@babel/preset-env", { targets: "defaults, IE >= 10, Safari >= 5.1" }],
  ],
};

const outputPath = path.resolve(__dirname, "dist/esm");

module.exports = [
  {
    entry: "./lib/index.js",
    output: {
      path: outputPath,
      filename: "qrex.js",
      library: {
        type: "module",
      },
      module: true,
      chunkFormat: "module",
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
    target: "web",
    experiments: {
      outputModule: true,
    },
  },
  {
    entry: "./lib/browser.js",
    output: {
      path: outputPath,
      filename: "qrex.browser.js",
      library: {
        type: "module",
      },
      module: true,
      chunkFormat: "module",
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
    target: "web",
    experiments: {
      outputModule: true,
    },
  },
];
