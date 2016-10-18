import curry from 'lodash.curry';
import {
  isWrapper,
  getTagUri,
 } from './selectors';

const defaults = { maxChainDepth: 5 };

function vastWrapperChainError(adChain) {
  const maxChainDepthErr = new Error('VastWrapperChain \'maxChainDepth\' reached');
  maxChainDepthErr.adChain = adChain;
  return maxChainDepthErr;
}

function validateChainDepth(adChain, maxChainDepth) {
  if (adChain.length > maxChainDepth) {
    return Promise.reject(vastWrapperChainError(adChain));
  }

  return Promise.resolve();
}

function wrapperChain(fetchAd, config, videoAdTag, adChain) {
  return validateChainDepth(adChain, config.maxChainDepth)
    .then(() => fetchAd(videoAdTag))
    .then((vastAdObj) => {
      const newAdChain = [...adChain, vastAdObj];

      if (isWrapper(vastAdObj)) {
        return wrapperChain(fetchAd, config, getTagUri(vastAdObj), newAdChain);
      }

      return Promise.resolve(newAdChain);
    });
}

export default curry((fetchAd, config = {}, vastAdObj) => {
  if (!isWrapper(vastAdObj)) {
    return Promise.resolve([vastAdObj]);
  }

  return wrapperChain(fetchAd, { ...defaults, ...config }, getTagUri(vastAdObj), [vastAdObj]);
}, 3);
