const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  mode: "production",
  plugins: [new CleanWebpackPlugin()],

  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
};
