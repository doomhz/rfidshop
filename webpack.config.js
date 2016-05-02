var path = require("path");
module.exports = {
  host: "0.0.0.0",
  entry: {
    main: [
      "./public/js/main.js"
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
  }
};