import test from 'ava';
import {
  isWrapper,
  getTagUri,
  hasAd,
  getAd,
  normaliseWaterfall,
} from '../../src/selectors';
import { createAsJs } from '../fixtures/vastFactory';

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

test('isWrapper must return true if the vastObj is a VAST wrapper', (t) => {
  t.true(isWrapper(vastWrapperObj));
});

test('isWrapper must return false otherwise', (t) => {
  t.false(isWrapper(nonVastWrapperObj));
  t.false(isWrapper());
  t.false(isWrapper(null));
  t.false(isWrapper('foo'));
  t.false(isWrapper(() => {}));
});

test('getTagUri must return the vastTagUri from the wrapper vastObj', t =>
  t.is(getTagUri(vastWrapperObj), 'http://expample.com')
);

test('getTagUri must return undefined if vastTagUri can not be found', (t) => {
  t.is(getTagUri(nonVastWrapperObj), undefined);
  t.is(getTagUri(), undefined);
  t.is(getTagUri(null), undefined);
  t.is(getTagUri('nonVastWrapperObj'), undefined);
  t.is(getTagUri(() => {}), undefined);
});

test('getAd must return the vast ad or undefined otherwise', (t) => {
  const ad = {};
  t.is(getAd({ vast: { ad } }), ad);
  t.is(getAd({ vast: { ad: undefined } }), undefined);
  t.is(getAd({}), undefined);
  t.is(getAd(null), undefined);
  t.is(getAd(), undefined);
});

test('hasAd must return true if there is at least an ad on the vastObj and false otherwise', (t) => {
  t.true(hasAd({ vast: { ad: {} } }));
  t.true(hasAd({ vast: { ad: [] } }));
  t.false(hasAd({ vast: { ad: undefined } }));
  t.false(hasAd({}));
  t.false(hasAd(null));
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
