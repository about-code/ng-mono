var path = require('path');
////////////////////////////////////////////////////////////////////////////////
const ENV = process.env.NODE_ENV = process.env.ENV = 'development';
////////////////////////////////////////////////////////////////////////////////
module.exports = {
  mode: 'development',
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(__dirname, '../tsconfig.json'),
          transpileOnly: true,
        }
      }
      ,{
        test: /\.tsx?$/,
        loader: 'angular2-template-loader',
        exclude: [/\.(spec|e2e)\.ts$/]
      }
      ,{
        test: /\.(html|css)$/,
        loader: 'raw-loader',
        exclude: /\.async\.(html|css)$/
      }
    ]
  }
};
