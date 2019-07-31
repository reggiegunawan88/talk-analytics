const dotenv = require('dotenv');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const env = dotenv.config().parsed;
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {
  entry: [
    './app/main.jsx',
    'babel-polyfill',
    'webpack-dev-server/client?http://localhost:8001/',
    'webpack/hot/dev-server',
  ],

  output: {
    publicPath: 'http://localhost:8001/build/',
    path: `${__dirname}/build`,
    filename: 'bundle.js',
    chunkFilename: '[name].[chunkhash].js',
  },

  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-1'],
        },
      },
      {
        test: /\.scss$/,
        use: [{
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            query: {
              modules: true,
              localIdentName: '[name]__[local]--[hash:base64:5]',
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }],
      },
      {
        test: /\.(jpg)$/,
        loader: 'file-loader',
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
      {
        test: /\.(png|gif|ttf|eot|woff|woff2|csv)$/,
        loader: 'url-loader?limit=100000',
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HTMLWebpackPlugin({
      template: `${__dirname}/assets/index.template.html`,
      filename: 'index.html',
    }),
    new webpack.DefinePlugin(envKeys),
  ],

  devServer: {
    contentBase: './build',
    colors: true,
    historyApiFallback: true,
    inline: true,
    hot: true,
    port: 8001,
  },

  resolve: {
    alias: {
      shared_components: path.resolve(__dirname, 'app/components'),
      Config: path.resolve(__dirname, 'app/config'),
      Modules: path.resolve(__dirname, 'app/modules'),
    },
    extensions: ['.js', '.jsx'],
  },

  node: {
    fs: 'empty',
  },
};