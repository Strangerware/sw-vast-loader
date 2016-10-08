// import fetchAd from './fetchAd';


export default (config = {}, masterAdTag) => {
  if (!masterAdTag) {
    return Promise.reject(new Error('adsLoader missing masterAdTag'));
  }

  return Promise.resolve();

  // fetchAd = _.curry(fetchAd)(config.fetch)
  // wrapperChain = _.curry(wrapperChain)(fetchAd)
  // waterfall = _.curry(waterfall)(wrapperChain, config)

  // fetchAd(masterAdTag)
  //   .then(wrapperChain)
  //   .then(waterfall)
  //   .then(()=>{})
  //   .catch(()=>{})
};
