import get from 'lodash.get';

export const isVastWrapper = (vastObj = {}) => !!get(vastObj, 'vast.ad.wrapper');

export const getVastTagUri = (vastObj = {}) => get(vastObj, 'vast.ad.wrapper.vastadtaguri');

export const getVastAd = (vastObj = {}) => get(vastObj, 'vast.ad');

export const hasVastAd = (vastObj = {}) => !!getVastAd(vastObj);

export const normaliseWaterfall = (vastObj = {}) => {
  const ads = getVastAd(vastObj);

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
