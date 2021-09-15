const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",

  entry: path.resolve(__dirname, "../src/index.js"),

  output: {
    path: path.resolve(__dirname, "../build"),
    filename: "bundle.js",
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../src/index.html"),
    }),
  ],

  devtool: "eval-cheap-module-source-map",

  devServer: {
    historyApiFallback: true,
    hot: true,
    static: "../build",
    port: "3000",
  },
};
