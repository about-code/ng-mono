var path = require('path');
var webpack = require('webpack');
var AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const devMode = process.env.ENV === 'development';
const outputPath = path.resolve(__dirname, '../', 'dist');

// =============== DEV-SERVER ===============
var serverConf;
try {
   // allow to overwrite a shared default config with a gitignored local config
  serverConf = require('./webpack.server.gitignore.js')
} catch (err) {
  serverConf = require('./webpack.server.js');
}
// =============== WEBPACK ===============
module.exports = {
  context: path.resolve(__dirname, '../'),
  serve: serverConf,
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
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ]
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin([outputPath], { allowExternal: true })
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
    ,new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? "[name].css" : "[name].[hash].css",
      chunkFilename: devMode ? "[id].css": "[id].[hash].css"
    })
    ,new webpack.LoaderOptionsPlugin({
      htmlLoader: {
        minimize: false // workaround for ng2
      }
    })
  ]
};
