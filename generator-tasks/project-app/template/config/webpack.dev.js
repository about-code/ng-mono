var path = require('path');
var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
////////////////////////////////////////////////////////////////////////////////
const ENV = process.env.NODE_ENV = process.env.ENV = 'development';
////////////////////////////////////////////////////////////////////////////////
module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',
  watch: true,
  entry: {
    'app': './src/app-jit.ts'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { 'ENV': JSON.stringify(ENV) }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills', 'theme']
    })
  ]
});
