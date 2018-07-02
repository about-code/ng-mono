const path = require('path');
const process = require('process');
const webpackMerge = require('webpack-merge');
const webpackTestConf = require('./webpack.test.js');

// ==== Command Line Arguments ====
const DEBUG = process.argv.filter(arg => arg === "debug").length > 0;

module.exports = function(config) {
  config.set({
    basePath: path.resolve(__dirname)
    ,files: ['./karma.shim.js'] // one webpack entry point requires all tests
    ,preprocessors: {
        './karma.shim.js': ['webpack']
    }
    ,plugins: [
        'karma-jasmine',
        ,'karma-webpack'
        ,'karma-chrome-launcher'
        ,'karma-coverage-istanbul-reporter'
    ]
    ,frameworks: ['jasmine']
    ,browsers: ['myChromeHeadless']
    ,customLaunchers: {
        myChromeHeadless: {
            base: 'ChromeHeadless'
            ,flags: ['--password-store=basic']
        }
    }
    // When debugging tests...
    // ...keep code readable and don't instrument it
    // ...keep watching files and recompile on changes
    ,autoWatch: DEBUG == true
    ,singleRun: DEBUG == false
    ,reporters: DEBUG == true ? [] : ['coverage-istanbul']
    ,webpack: webpackMerge(webpackTestConf, {
        watch: DEBUG == true
        ,module: {
            rules: [{
                test: /\.tsx?$/
                ,loader: 'istanbul-instrumenter-loader'
                ,enforce: 'post'
                ,options: { esModules: true }
                ,exclude: [/\.(spec|e2e|mock)\.tsx?/, /node_modules/]
            }]
        }
    })
    ,webpackMiddleware: { stats: 'errors-only' }
    ,coverageIstanbulReporter: {
        dir: path.resolve(__dirname, '../reports/coverage')
        ,reports: ['html', 'text-summary', 'lcovonly']
        ,fixWebpackSourcePaths: true
    }
    ,logLevel: config.LOG_INFO
    ,colors: true
    // ,autoWatchBatchDelay: 300
    // ,captureTimeout: 6000
  });
};
