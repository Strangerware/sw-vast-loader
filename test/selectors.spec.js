import test from 'ava';
import {
  isVastWrapper,
  getVastTagUri,
  hasVastAd,
  getVastAd,
  normaliseWaterfall,
} from '../src/selectors';
import { createAsJs } from './fixtures/vastFactory';

const vastWrapperObj = {
  vast: {
    ad: {
      wrapper: {
        vastadtaguri: 'http://expample.com',
      },
    },
  },
};

const nonVastWrapperObj = {
  vast: {
    ad: {
      inline: '',
    },
  },
};

test('isVastWrapper must return true if the vastObj is a VAST wrapper', (t) => {
  t.true(isVastWrapper(vastWrapperObj));
});

test('isVastWrapper must return false otherwise', (t) => {
  t.false(isVastWrapper(nonVastWrapperObj));
  t.false(isVastWrapper());
  t.false(isVastWrapper(null));
  t.false(isVastWrapper('foo'));
  t.false(isVastWrapper(() => {}));
});

test('getVastTagUri must return the vastTagUri from the wrapper vastObj', t =>
  t.is(getVastTagUri(vastWrapperObj), 'http://expample.com')
);

test('getVastTagUri must return undefined if vastTagUri can not be found', (t) => {
  t.is(getVastTagUri(nonVastWrapperObj), undefined);
  t.is(getVastTagUri(), undefined);
  t.is(getVastTagUri(null), undefined);
  t.is(getVastTagUri('nonVastWrapperObj'), undefined);
  t.is(getVastTagUri(() => {}), undefined);
});

test('getVastAd must return the vast ad or undefined otherwise', (t) => {
  const ad = {};
  t.is(getVastAd({ vast: { ad } }), ad);
  t.is(getVastAd({ vast: { ad: undefined } }), undefined);
  t.is(getVastAd({}), undefined);
  t.is(getVastAd(null), undefined);
  t.is(getVastAd(), undefined);
});

test('hasVastAd must return true if there is at least an ad on the vastObj and false otherwise', (t) => {
  t.true(hasVastAd({ vast: { ad: {} } }));
  t.true(hasVastAd({ vast: { ad: [] } }));
  t.false(hasVastAd({ vast: { ad: undefined } }));
  t.false(hasVastAd({}));
  t.false(hasVastAd(null));
});

test('normalise waterfall must return an array with the normalised waterfall', async(t) => {
  const noAdsWaterfall = await createAsJs([]);
  const oneAdWaterfall = await createAsJs([{ type: 'ad' }]);
  const vastWrapper = await createAsJs([{ type: 'wrapper' }]);
  const vastNonWrapper = await createAsJs([{ type: 'ad' }]);
  const adsWaterfall = await createAsJs([
    { type: 'wrapper' },
    { type: 'ad' },
  ]);

  /* eslint no-param-reassign: ["error", { "props": false }]*/
  const expected = [vastWrapper, vastNonWrapper]
    .map((vastObj, index) => {
      vastObj.vast.ad.$.id = `${index}`;
      return vastObj;
    });

  t.deepEqual(normaliseWaterfall(noAdsWaterfall), [noAdsWaterfall]);
  t.deepEqual(normaliseWaterfall(oneAdWaterfall), [oneAdWaterfall]);
  t.deepEqual(normaliseWaterfall(adsWaterfall), expected);
});
