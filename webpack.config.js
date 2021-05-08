const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: ['@babel/polyfill', './js/bin/index.js'],
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'public'),
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  performance: {
    maxEntrypointSize: 600000,
    maxAssetSize: 600000,
  },
  devServer: {
    port: 5000,
    hot: isDev,
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html',
    }),
    new CleanWebpackPlugin(),
    new ESLintPlugin({
      exclude: path.resolve(__dirname, 'node_modules'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['@babel/preset-env'] },
          },
        ],
      },
    ],
  },
};
