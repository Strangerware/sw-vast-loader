import { parseString } from 'xml2js';

const promisify = function (func) {
  return new Promise((resolve, reject) => {
    func((error, result) => {
      if (error) {
        return reject(error);
      }

      return resolve(result);
    });
  });
};

const DEFAULTS = {
  explicitArray: false,
  normalizeTags: true,
  normalize: true,
  async: true,
};

export default xml =>
  promisify(cb => parseString(xml, DEFAULTS, cb));
