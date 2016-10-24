import fetchAd from './fetchAd';
import wrapperChain from './wrapperChain';
import waterfall from './waterfall';
import {
  hasAd,
  normaliseWaterfall,
 } from './selectors';

function validate(vastObj) {
  if (!hasAd(vastObj)) {
    const adsLoaderErr = new Error('adsLoader missing ad on VAST response');
    adsLoaderErr.data = vastObj;
    throw adsLoaderErr;
  }

  return vastObj;
}

function adsLoader(config = {}, videoAdTag) {
  if (!videoAdTag) {
    return Promise.reject(new Error('adsLoader missing videoAdTag'));
  }

  const requestAd = fetchAd(config.fetch);
  const doChain = wrapperChain(requestAd, config);

  return requestAd(videoAdTag)
    .then(validate)
    .then(normaliseWaterfall)
    .then(waterfall(doChain, config));
}

export default adsLoader;
