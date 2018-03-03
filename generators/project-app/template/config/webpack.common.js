var path = require('path');
var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// =============== DEV-SERVER ===============
var serverConf;
try {
   // allow to overwrite a shared default config with a gitignored local config
  serverConf = require('./webpack.server.gitignore.js')
} catch (err) {
  serverConf = require('./webpack.server.js');
}
// =============== SASS ===============
const outputPath = path.resolve(__dirname, '../', 'dist');
const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});
// =============== WEBPACK ===============
module.exports = {
  context: path.resolve(__dirname, '../'),
  devServer: serverConf,
  entry: {
    'theme': './src/bundle-theme.ts',
    'polyfills': './src/bundle-polyfills.ts',
    'vendor': './src/bundle-vendor.ts'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: ['node_modules', './packages']
  },
  output: {
    path: outputPath,
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js',
    publicPath: '<%= app_ctx_root %>'
  },
  module: {
    rules: [
      {
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        loader: '@ngtools/webpack',
        //sourcemap: true
      }
      ,{
        test: /\.html$/,
        loader: 'html-loader'
      }
      ,{
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      }
      ,{
        test: /\.scss$/,
        use: extractSass.extract({
            use: [{
                loader: "css-loader"
            }, {
                loader: "sass-loader"
            }],
            // use style-loader in development
            fallback: "style-loader"
        })
      }
    ]
  },

  plugins: [
    extractSass
    ,new CleanWebpackPlugin([outputPath])
    ,new AngularCompilerPlugin({
      tsConfigPath: './tsconfig.json',
    })
    // Workaround for angular/angular#11580
    ,new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)@angular/,
      path.resolve(__dirname, '.', 'src'),
      {} // a map of your routes
    )
    ,new HtmlWebpackPlugin({
      template: './src/index.html'
    })
    ,new webpack.LoaderOptionsPlugin({
      htmlLoader: {
        minimize: false // workaround for ng2
      }
    })
  ]
};
