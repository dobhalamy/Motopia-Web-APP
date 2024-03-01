/* eslint-disable no-param-reassign */
const withImages = require('next-images');
const path = require('path');
const withFonts = require('next-fonts');
const withCSS = require('@zeit/next-css');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const {
  serverRuntimeConfig,
  publicRuntimeConfig,
} = require('./next.runtimeConfig');

module.exports = withImages(
  withFonts({
    ...withCSS({
      distDir: '_next',
      trailingSlash: true, // To add/remove trailing slash at production mode
      cssLoaderOptions: {
        url: false,
      },
      serverRuntimeConfig,
      publicRuntimeConfig,
      images: {
        domains: ['res.cloudinary.com'], // Add your hostname here
      },
      webpack: (config, { dev }) => {
        if (dev) {
          config.module.rules.push({
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'eslint-loader',
            options: {
              emitWarning: dev,
            },
          });
        }

        config.resolve.alias.src = path.join(__dirname, 'src');
        config.resolve.alias.components = path.join(
          __dirname,
          './src/components'
        );
        config.resolve.alias.assets = path.join(__dirname, './src/assets');
        config.resolve.alias.utils = path.join(__dirname, './src/utils');
        config.optimization.minimizer = [];
        config.optimization.minimizer.push(new OptimizeCSSAssetsPlugin({}));
        return config;
      },
    }),
  })
);
