const webpack = require('webpack');

module.exports = {
  webpack: (config, env) => {
    // ポリフィルの追加
    config.resolve.fallback = {
      "crypto": require.resolve("crypto-browserify"),
      "buffer": require.resolve("buffer/"),
      "stream": require.resolve("stream-browserify"),
      "assert": require.resolve("assert/"),
      "http": require.resolve("http-browserify"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify"),
      "url": require.resolve("url/"),
      "process": require.resolve("process/browser")
    };

    // ポリフィルを提供するためのプラグインの追加
    config.plugins = [
      ...config.plugins,
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      }),
    ];

    return config;
  },
};
