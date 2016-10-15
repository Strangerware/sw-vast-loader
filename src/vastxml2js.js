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

const defaults = {
  explicitArray: false,
  normalizeTags: true,
  normalize: true,
  async: true,
};

export default xml =>
  promisify(cb => parseString(xml, defaults, cb));
