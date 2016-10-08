import { isVastWrapper, getVastTagUri } from './selectors';

const defaults = { maxChainDepth: 5 };

function vastWrapperChainError(adChain) {
  const maxChainDepthErr = new Error('VastWrapperChain \'maxChainDepth\' reached');
  maxChainDepthErr.adChain = adChain;
  return maxChainDepthErr;
}

function validateChainDepth(adChain, maxChainDepth) {
  if (adChain.length >= maxChainDepth) {
    return Promise.reject(vastWrapperChainError(adChain));
  }

  return Promise.resolve();
}

function vastWrapperChain(fetchAd, config, adChain = []) {
  return validateChainDepth(adChain, config.maxChainDepth)
    .then(() => fetchAd(config.adTag, config))
    .then((vastAdObj) => {
      const newAdChain = [...adChain, vastAdObj];

      if (isVastWrapper(vastAdObj)) {
        const adTag = getVastTagUri(vastAdObj);
        return vastWrapperChain(fetchAd, { ...config, adTag }, newAdChain);
      }

      return Promise.resolve(newAdChain);
    });
}

export default (fetchAd, config = {}) =>
  vastWrapperChain(fetchAd, { ...defaults, ...config });
