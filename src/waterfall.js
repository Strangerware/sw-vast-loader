import curry from 'lodash.curry';

const identity = ad => ad;

const doWaterfall = (currentChain, nextChain) =>
  currentChain
    .catch(prevErrors =>
      nextChain()
        .catch(nextErrors =>
          Promise.reject([...prevErrors, ...nextErrors])
        )
    );


export default curry((wrapperChain, { validate = identity }, ads = []) => {
  const createChain = ad => () =>
    wrapperChain(ad)
      .then(validate)
      .catch(e => Promise.reject([e]));

  return ads
    .map(createChain)
    .reduce(doWaterfall, Promise.reject([]));
}, 3);
