const HtmlWebpackPlugin = require("html-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "../src/index.jsx"),

  output: {
    path: path.resolve(__dirname, "../build"),
    filename: "bundle.js",
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        exclude: /\node_modules/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../src/index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "index.css",
    }),
  ],
};
