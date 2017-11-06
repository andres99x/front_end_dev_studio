const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin(path.join('css', 'bundle.css'));

module.exports = {
  entry: path.resolve(__dirname, 'assets', 'js', 'main.js'),
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    port: 8080,
    host: "0.0.0.0",
    index: 'index.htm',
    contentBase: path.join(__dirname),
    compress: true,
    progress: true,
    publicPath: '/dist',
    overlay: {
      warnings: true,
      errors: true
    }
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: "eslint-loader",
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', { "modules": false, "targets": { "browsers": "> 0%" }, "useBuiltIns": true }]
            ]
          }
        }
      },
      {
        test: /\.scss$/,
        use: extractCSS.extract({ use: ['css-loader', 'sass-loader'] })
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader:'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
              publicPath: 'images/'
            }
          }
        ]
      },
      {
        test: /\.(svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader:'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
              publicPath: 'fonts/'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    extractCSS
  ]
};
