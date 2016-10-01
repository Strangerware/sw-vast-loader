import 'isomorphic-fetch';
import { parseString } from 'xml2js';

const promisify = (func) => new Promise(
  (resolve, reject) => {
    func((err, result)=> {
      err ? reject(err) : resolve(result);
    });
  }
);

export default function(masterAdTag, config={}) {
  return fetch(masterAdTag, config)
    .then((res) =>
      promisify((cb) => 
        parseString(res.text(), cb)
      )
    )
};
