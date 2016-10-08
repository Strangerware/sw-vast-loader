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

export default function (masterAdTag, config = {}) {
  const parseStrDefaults = { explicitArray: false, normalizeTags: true, normalize: true };
  return fetch(masterAdTag, config)
    .then(res =>
      promisify(cb =>
        parseString(res.text(), parseStrDefaults, cb)
      )
    );
}
