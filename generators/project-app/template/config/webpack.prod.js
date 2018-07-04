var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
////////////////////////////////////////////////////////////////////////////////
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
////////////////////////////////////////////////////////////////////////////////
module.exports = webpackMerge(commonConfig, {
  mode: 'production',
  entry: {
    'app': './src/app-aot.ts'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { 'ENV': JSON.stringify(ENV) }
    })
  ]
});
