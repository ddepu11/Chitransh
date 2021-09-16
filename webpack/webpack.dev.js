const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const path = require('path');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: 'development',

  plugins: [new ReactRefreshWebpackPlugin(), new BundleAnalyzerPlugin()],

  devtool: 'eval-cheap-module-source-map',

  devServer: {
    historyApiFallback: true,
    hot: true,
    static: '../build',
    port: '3000',
  },
};
