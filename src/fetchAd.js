import 'isomorphic-fetch';
import { parseString } from 'xml2js';

const promisify = func => new Promise(
  (resolve, reject) => {
    func((error, result) => {
      if (error) {
        return reject(error);
      }

      return resolve(result);
    });
  }
);

export default function (config = {}, videoAdTag) {
  const parseStrDefaults = { explicitArray: false, normalizeTags: true, normalize: true };
  return fetch(videoAdTag, config)
    .then(res =>
      promisify(cb =>
        parseString(res.text(), parseStrDefaults, cb)
      )
    );
}
