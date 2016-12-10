import fetchAd from './fetchAd';
import wrapperChain from './wrapperChain';
import waterfall from './waterfall';
import {
  hasAd,
  normaliseVastResponse,
 } from './selectors';

const validate = function (vastObj) {
  if (!hasAd(vastObj)) {
    const adsLoaderErr = new Error('adsLoader missing ad on VAST response');
    adsLoaderErr.data = vastObj;
    throw adsLoaderErr;
  }

  return vastObj;
};

const getType = (ads) => {
  if (!ads || ads.length === 0) {
    return 'error';
  }

  return 'stand-alone';
};

const adsLoader = function (config = {}, videoAdTag) {
  if (!videoAdTag) {
    return Promise.reject(new Error('adsLoader missing videoAdTag'));
  }

  const requestAd = fetchAd(config.fetch);
  const doChain = wrapperChain(requestAd, config);

  return requestAd(videoAdTag)
    .then(validate)
    .then(normaliseVastResponse)
    .then(waterfall(doChain))
    .then(({ ads, failedAds }) => {
      return {
        ads,
        failedAds,
        type: getType(ads),
      };
    });
};

export default adsLoader;
