/* eslint-disable no-undef */
const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = async (env, argv) => {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Remove Expo’s defaults so we can control HTML/manifest/SW
  config.plugins = (config.plugins || []).filter(
    (p) => !['HtmlWebpackPlugin', 'WebpackManifestPlugin'].includes(p?.constructor?.name)
  );

  // No Node polyfills needed:
  config.resolve = { ...(config.resolve || {}), fallback: { ...(config.resolve?.fallback || {}) } };

  config.plugins.push(
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
      inject: 'body',
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        description: 'Taxi Identification — Helper for Drivers',
        'theme-color': '#024A59',
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'app.webmanifest'), to: 'app.webmanifest' },
        { from: path.resolve(__dirname, 'service-worker.js'), to: 'service-worker.js' },
        { from: path.resolve(__dirname, 'assets'), to: 'assets' },
      ],
    })
  );

    // Add resolve.fallback configuration for Node.js core modules
  config.resolve = {
    ...config.resolve, // Ensure we keep any existing resolve configuration
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      vm: require.resolve('vm-browserify'),
    },
  };
  
  return config;
};
