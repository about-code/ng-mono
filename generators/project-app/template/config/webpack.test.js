var path = require('path');
var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
////////////////////////////////////////////////////////////////////////////////
const ENV = process.env.NODE_ENV = process.env.ENV = 'development';
////////////////////////////////////////////////////////////////////////////////
module.exports = {
  devtool: 'cheap-module-eval-source-map',
  watch: true,
  plugins: []
};
