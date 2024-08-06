const path = require('path');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  resolve: {
    fallback: {
      fs: false,
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
    },
    alias: {
      'node:events': 'events',
      'node:buffer': 'buffer',
      'node:process': 'process/browser',
      'node:path': 'path-browserify',
      'node:url': 'url',
      'node:util': 'util',
      'node:stream': 'stream-browserify',
      'node:zlib': 'browserify-zlib',
      'node:assert': 'assert',
      'node:crypto': 'crypto-browserify',
      'node:fs': 'memfs',
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
    new NodePolyfillPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: 'node:',
          replace: '',
        },
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
