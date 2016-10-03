const identity = ad => ad;

const doWaterfall = (currentChain, nextChain) => 
  currentChain
    .catch(prevErrors => 
      nextChain()
        .catch(nextErrors =>
          Promise.reject([...prevErrors, ...nextErrors])
        ) 
    );

const error2Array = e => Promise.reject([e]);

export default (wrapperChain, { validate = identity }, ads = []) => {
  const createChain = ad => () =>
    wrapperChain(ad)
      .then(validate)
      .catch(error2Array);
  
  return ads
    .map(createChain)
    .reduce(doWaterfall, Promise.reject([]));
};
