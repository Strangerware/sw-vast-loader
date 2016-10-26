import 'isomorphic-fetch';
import curry from 'lodash.curry';
import VastError from 'sw-vast-errors';
import vastxml2js from './vastxml2js';

const fetchAd = function (config = {}, videoAdTag) {
  return fetch(videoAdTag, config)
    .then(res => vastxml2js(res.text()))
    .catch((error) => {
      if (!(error instanceof VastError)) {
        throw new VastError({ errorCode: 301, error });
      }

      throw error;
    });
};

export default curry(fetchAd, 2);
