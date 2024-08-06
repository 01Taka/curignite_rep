const webpackConfig = require('./webpack.config');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      return webpackConfig;
    },
  },
};
