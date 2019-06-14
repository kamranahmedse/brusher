const path = require('path');

module.exports = {
  mode: 'production',
  entry: [
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, '/dist'),
    // publicPath: '/dist/',
    filename: 'brusher.min.js',
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
              '@babel/preset-env',
              {
                corejs: '2',
                useBuiltIns: 'usage',
              },
            ],
          ],
          plugins: [
            'add-module-exports',
            '@babel/plugin-proposal-object-rest-spread',
          ],
        },
      },
    ],
  },
  plugins: [],
  stats: {
    colors: true,
  },
  devtool: 'cheap-module-source-map',
};
