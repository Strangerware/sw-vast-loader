"use strict";

import { assert } from 'chai';
import AdsLoader from '../src/AdsLoader';

describe('AdsLoader', () => {
  it('must be a class', () => {
    assert.instanceOf(new AdsLoader(), AdsLoader);
  });

  describe('requestAd', ()=> {
    it('must return a promise', ()=>  {
      const adsLoader = new AdsLoader();
      assert.instanceOf(adsLoader.requestAd(), Promise);
    });
  })
});
    
