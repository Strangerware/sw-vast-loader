import curry from 'lodash.curry';

const runNext = function (chain, errors) {
  if (errors.length >= chain.length) {
    return Promise.reject(errors);
  }

  return chain[errors.length]()
    .catch(error => runNext(chain, [...errors, error]));
};

const waterfall = function (doChain, ads = []) {
  const chain = ads.map(ad => () => doChain(ad));
  return runNext(chain, []);
};

export default curry(waterfall, 2);
