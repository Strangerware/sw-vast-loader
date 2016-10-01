import fetchAd from './fetchAd';

const defaults = {};

export default (config = {}, masterAdTag) => {
  config = {...defaults, ...config};
  if (!masterAdTag)
    return Promise.reject(new Error('adsLoader missing masterAdTag'));
};
