import curry from 'lodash.curry';
import {
  isWrapper,
  getTagUri,
 } from './selectors';

const DEFAULTS = {
  maxChainDepth: 5,
  validate: chain => chain,
};

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

function wrapperChain(requestAd, config, videoAdTag, adChain) {
  return validateChainDepth(adChain, config.maxChainDepth)
    .then(() => requestAd(videoAdTag))
    .then((vastAdObj) => {
      const newAdChain = [...adChain, vastAdObj];

      if (isWrapper(vastAdObj)) {
        return wrapperChain(requestAd, config, getTagUri(vastAdObj), newAdChain);
      }

      return Promise.resolve(newAdChain);
    });
}


export default curry((requestAd, conf = {}, vastAdObj) => {
  if (!isWrapper(vastAdObj)) {
    return Promise.resolve([vastAdObj]);
  }
  const config = Object.assign({}, DEFAULTS, conf);

  return wrapperChain(requestAd, config, getTagUri(vastAdObj), [vastAdObj])
    .then(config.validate);
}, 3);
