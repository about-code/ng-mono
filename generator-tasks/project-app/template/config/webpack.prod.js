var path = require('path');
var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
////////////////////////////////////////////////////////////////////////////////
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
////////////////////////////////////////////////////////////////////////////////
module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',
  entry: {
    'app': './src/app-aot.ts'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { 'ENV': JSON.stringify(ENV) }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills', 'theme']
    }),
    new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
      mangle: {
        keep_fnames: true
      }
    })
  ]
});
