// craco.config.js
const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // モジュールのフォールバック設定
      webpackConfig.resolve.fallback = {
        fs: false,
        http2: false,
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify'),
        buffer: require.resolve('buffer/'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        zlib: require.resolve('browserify-zlib'),
        util: require.resolve('util/'),
        events: require.resolve('events/'),
        assert: require.resolve('assert'),
        process: require.resolve('process/browser'),
        vm: require.resolve('vm-browserify'),
      };

      // プロバイダプラグインの設定
      webpackConfig.plugins = (webpackConfig.plugins || []).concat([
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        }),
      ]);

      // モジュールルールの設定
      webpackConfig.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      });

      return webpackConfig;
    },
  },
};
