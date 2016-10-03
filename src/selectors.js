import get from 'lodash.get';

export const isVastWrapper = (vastObj={}) => !!get(vastObj, 'vast.ad.wrapper');

export const getVastTagUri = (vastObj={}) => get(vastObj, 'vast.ad.wrapper.vasttaguri');