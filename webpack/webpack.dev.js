const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',

  plugins: [new ReactRefreshWebpackPlugin()],

  devtool: 'eval-cheap-module-source-map',

  devServer: {
    historyApiFallback: true,
    hot: true,
    static: '../build',
    port: '3000',
  },
};
