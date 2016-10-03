import fetchAd from './fetchAd';

const defaults = {};

export default (config = {}, masterAdTag) => {
  config = {...defaults, ...config};
  if (!masterAdTag) {
    return Promise.reject(new Error('adsLoader missing masterAdTag'));
  }


  // fetchAd = _.curry(fetchAd)(config.fetch)
  // wrapperChain = _.curry(wrapperChain)(fetchAd)
  // waterfall = _.curry(waterfall)(wrapperChain, config)

  // fetchAd(masterAdTag)
  //   .then(wrapperChain)
  //   .then(waterfall)
  //   .then(()=>{})
  //   .catch(()=>{})
};
