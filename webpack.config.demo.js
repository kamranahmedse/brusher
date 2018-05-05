const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const scriptFileName = isProduction ? 'brusher-demo.min.js' : 'brusher-demo.js';
const styleFileName = isProduction ? 'brusher-demo.min.css' : 'brusher-demo.css';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    './demo/styles/demo.scss',
    './demo/scripts/demo.js',
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, '/dist/demo'),
    filename: scriptFileName,
    libraryTarget: 'umd',
    library: 'Brusher',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        enforce: 'pre',
        options: {
          failOnWarning: false,
          failOnError: true,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              'env',
              {
                useBuiltIns: 'usage',
              },
            ],
          ],
          plugins: [
            'babel-plugin-add-module-exports',
            'transform-object-rest-spread',
          ],
        },
      },
      {
        test: /.scss$/,
        loader: ExtractTextPlugin.extract([
          {
            loader: 'css-loader',
            options: {minimize: isProduction, url: false},
          },
          'sass-loader',
        ]),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: styleFileName,
      allChunks: true,
    }),
    new CopyWebpackPlugin([
      {from: './demo/images', to: 'images'}
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'demo/home.html',
    }),
  ],
  stats: {
    colors: true,
  },
  devtool: 'cheap-module-eval-source-map',
};
