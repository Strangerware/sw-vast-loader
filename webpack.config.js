"use strict";

const config = {
  entry: './src/AdsLoader.js',
  output: {
    path: __dirname + "/dist/",
    filename: 'adsLoader.js'
  },
  module: {
    loaders: [
      {
        loader: 'babel',
        include: __dirname,
        exclude: /node_modules/,
        query: {
          presets: ['es2017']
        }
      }
    ]
  },
};

module.exports = config;