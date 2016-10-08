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

function wrapperChain(fetchAd, config, videoAdTag, adChain = []) {
  return validateChainDepth(adChain, config.maxChainDepth)
    .then(() => fetchAd(videoAdTag))
    .then((vastAdObj) => {
      const newAdChain = [...adChain, vastAdObj];

      if (isVastWrapper(vastAdObj)) {
        return wrapperChain(fetchAd, config, getVastTagUri(vastAdObj), newAdChain);
      }

      return Promise.resolve(newAdChain);
    });
}

export default (fetchAd, config = {}, videoAdTag) =>
  wrapperChain(fetchAd, { ...defaults, ...config }, videoAdTag);
