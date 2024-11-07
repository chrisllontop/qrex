const path = require("path");
const babelConfig = {
  babelrc: false,
  presets: [
    ["@babel/preset-env", { targets: "defaults, IE >= 10, Safari >= 5.1" }],
  ],
};

module.exports = [
  {
    entry: "./lib/browser.js",
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "qrcode.esm.js",
      library: {
        type: "module",
      },
      module: true, // Ensure Rspack treats this as ESM output
      chunkFormat: "module", // Set ESM-compatible chunk format
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
      outputModule: true, // Enable ESM module output
    },
  },
  {
    entry: "./helper/to-sjis-browser.js",
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "qrcode.tosjis.esm.js",
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
