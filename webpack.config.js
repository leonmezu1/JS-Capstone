const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: {
    index: './src/js/index.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'js/[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' }, { loader: 'css-loader' },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.png/,
        use: 'file-loader?name=[name].[ext]&outputPath=./images/',
        exclude: /node_modules/,
      },
      {
        test: /\.jpg/,
        use: 'file-loader?name=[name].[ext]&outputPath=./images/',
        exclude: /node_modules/,
      },
      {
        test: /\.svg/,
        use: 'file-loader?name=[name].[ext]&outputPath=./images/',
        exclude: /node_modules/,
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: 'file-loader?name=[name].[ext]&outputPath=./images/',
        exclude: /node_modules/,
      },
      {
        test: /\.(csv|tsv)$/,
        use: 'csv-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    host: 'localhost',
    port: 7000,
    contentBase: path.join(__dirname, './'),
    watchContentBase: true,
    compress: true,
    hot: true,
    disableHostCheck: true,
  },
  plugins: [
    new Dotenv(),
  ],
};