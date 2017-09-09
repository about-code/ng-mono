var path = require('path');
var webpack = require('webpack');
var webpackTestConf = require('./webpack.test.js');

module.exports = function(config) {
  config.set({
    basePath: path.resolve(__dirname),
    files: [
        // only specify one entry point and require all tests in there
        './karma.shim.js',
    ],
    preprocessors: {
        // add webpack as preprocessor
        './karma.shim.js': ['webpack']//, 'sourcemap']
    },
    plugins: [
        'karma-jasmine',
        'karma-webpack',
        // 'karma-phantomjs-launcher',
        'karma-chrome-launcher'
    ],
    frameworks: [
        'jasmine'
    ],
    webpack: webpackTestConf,
    webpackMiddleware: {
      // webpack-dev-middleware configuration
      stats: 'errors-only'
    },
    browsers: [
        // 'PhantomJS',
        'ChromeHeadless'
    ],
    // port: 9999,
    // singleRun: true,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    // autoWatchBatchDelay: 300,
    // captureTimeout: 6000,
  });
};
