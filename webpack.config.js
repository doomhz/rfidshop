var path = require("path");
var webpack = require("webpack");
config = {
  host: "0.0.0.0",
  entry: {
    main: [
      "./public/js/App.js"
    ]
  },
  output: {
    path: './public/js/',
    filename: 'index.js'
  },
  devServer: {
    inline: true,
    port: 3333
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react']
      }
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  watchOptions: {
    poll: 500
  },
  plugins:[
  ]
};

if (process.env.NODE_ENV === "production") {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    })
  );
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress:{
        warnings: true
      }
    })
  );
}

module.exports = config;