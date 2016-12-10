import curry from 'lodash.curry';
import { isWrapper } from './selectors';

const isComplete = (chain, errors) => errors.length >= chain.length;

const runNext = function (chain, failedAds) {
  if (isComplete(chain, failedAds)) {
    return Promise.resolve({ failedAds });
  }

  return chain[failedAds.length]()
    .then(ads => ({ ads, failedAds }))
    .catch(errors => runNext(chain, [...failedAds, ...errors]));
};

const waterfall = function (doChain, ads = []) {
  const chain = ads.map(ad => () => {
    if (!isWrapper(ad)) {
      return Promise.resolve({
        ads: [ad],
      });
    }

    return doChain(ad);
  });
  return runNext(chain, []);
};

export default curry(waterfall, 2);
