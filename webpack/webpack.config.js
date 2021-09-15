const { merge } = require("webpack-merge");
const commonWebPackFile = require("./webpack.common");

module.exports = (envVars) => {
  const { env } = envVars;

  const choosenWebpackFile = require(`./webpack.${env}.js`);

  return merge(commonWebPackFile, choosenWebpackFile);
};
