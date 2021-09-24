const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',

  plugins: [new CleanWebpackPlugin()],

  devtool: 'source-map',

  optimization: {
    moduleIds: 'deterministic',
    minimize: true,
  },
};
