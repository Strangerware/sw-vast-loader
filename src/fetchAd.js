import 'isomorphic-fetch';

const defaults = {};

export default (config, masterAdTag) => {
  config = {...defaults, ...config};
  return Promise.reject(new Error('fetchAd missing config'));
};