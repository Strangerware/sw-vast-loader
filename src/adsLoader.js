import fetchAd from './fetchAd';
import wrapperChain from './wrapperChain';
import waterfall from './waterfall';
import {
  hasVastAd,
  normaliseWaterfall,
 } from './selectors';

const validate = (vastObj) => {
  if (!hasVastAd(vastObj)) {
    const adsLoaderErr = new Error('adsLoader missing ad on VAST response');
    adsLoaderErr.data = vastObj;
    throw adsLoaderErr;
  }

  return vastObj;
};

export default (config = {}, videoAdTag) => {
  if (!videoAdTag) {
    return Promise.reject(new Error('adsLoader missing videoAdTag'));
  }

  const requestAd = fetchAd(config.fetch);

  return requestAd(videoAdTag)
    .then(validate)
    .then(normaliseWaterfall)
    .then(waterfall(wrapperChain(requestAd, config), config));
};
