import get from 'lodash.get';

export const isWrapper = (vastObj = {}) => !!get(vastObj, 'vast.ad.wrapper');

export const getTagUri = (vastObj = {}) => get(vastObj, 'vast.ad.wrapper.vastadtaguri');

export const getAd = (vastObj = {}) => get(vastObj, 'vast.ad');

export const hasAd = (vastObj = {}) => !!getAd(vastObj);

export const normaliseWaterfall = (vastObj = {}) => {
  const ads = getAd(vastObj);

  if (Array.isArray(ads)) {
    const vast = { ...vastObj.vast, ...{ ad: null } };
    const sharedVastJson = JSON.stringify({ ...vastObj, vast });

    return ads.map((ad) => {
      const newVastObj = JSON.parse(sharedVastJson);
      newVastObj.vast.ad = ad;
      return newVastObj;
    });
  }

  return [vastObj];
};
