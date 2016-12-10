import curry from 'lodash.curry';
import VastError from 'sw-vast-errors';
import {
  isWrapper,
  getTagUri,
 } from './selectors';

const DEFAULTS = {
  maxChainDepth: 5,
  validate: chain => chain,
};

const validateChainDepth = function (adChain, { maxChainDepth }) {
  if (adChain.length > maxChainDepth) {
    return Promise.reject(new VastError({ errorCode: 302 }));
  }

  return Promise.resolve();
};

const isComplete = adChain => !isWrapper(adChain[adChain.length - 1]);

const wrapperChain = function (requestAd, config, videoAdTag, adChain) {
  if (isComplete(adChain)) {
    return [adChain];
  }

  return validateChainDepth(adChain, config)
    .then(() => requestAd(videoAdTag))
    .catch((error) => {
      const vastError = error instanceof VastError
        ? error
        : new VastError({ errorCode: 900, error });

      return Promise.reject([
        [...adChain, vastError],
      ]);
    })
    .then(vastAdObj =>
      wrapperChain(requestAd, config, getTagUri(vastAdObj), [...adChain, vastAdObj]));
};

export default curry((requestAd, conf = {}, vastAdObj) => {
  const config = { ...DEFAULTS, ...conf };

  return wrapperChain(requestAd, config, getTagUri(vastAdObj), [vastAdObj])
    .then(config.validate);
}, 3);
