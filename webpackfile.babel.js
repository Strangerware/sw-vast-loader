// eslint-disable-next-line import/no-extraneous-dependencies
import webpack from 'webpack';
import path from 'path';

const config = {
  entry: {
    adsLoader: './src/adsLoader.js',
    'adsLoader.min': './src/adsLoader.js',
  },
  output: {
    path: 'dist/',
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'stage-2'],
        },
      },
    ],
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      include: /\.min\.js/,
      compress: {
        warnings: false,
      },
    }),
  ],
  devtool: 'source-map',
};

export default config;
