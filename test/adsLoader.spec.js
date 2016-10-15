import test from 'ava';
import root from 'window-or-global';
import sinon from 'sinon';
import adsLoader from '../src/adsLoader';
import vastxml2js from '../src/vastxml2js';
import { normaliseWaterfall } from '../src/selectors';
import { createAsXml } from './fixtures/vastFactory';

test.beforeEach(() => sinon.stub(root, 'fetch'));
test.afterEach(() => root.fetch.restore());

test.serial('must reject the promise if you don\'t pass a videoAdTag', t => t.throws(
  adsLoader(), 'adsLoader missing videoAdTag'
));

test.serial('must fail if there is no ad on the VAST response', (t) => {
  root.fetch.returns(Promise.resolve({ text: () => createAsXml([]) }));
  t.throws(adsLoader({}, 'http://example.com/'), 'adsLoader missing ad on VAST response');
});

test.serial('must return the ad chain', async (t) => {
  const ad = createAsXml([{ type: 'ad' }]);
  root.fetch.returns(
    Promise.resolve({ text: () => ad })
  );
  const adChain = await adsLoader({}, 'http://example.com/');
  const expectedAd = await vastxml2js(ad);
  t.deepEqual(adChain, [expectedAd]);
});

test.serial('must do the wrapper chain to get the ad', async (t) => {
  const wrapperAd = createAsXml([{ type: 'wrapper', uri: 'http://example.com' }]);
  const nonWrapperAd = createAsXml([{ type: 'ad' }]);

  root.fetch
    .onFirstCall()
      .returns(Promise.resolve({ text: () => wrapperAd }))
    .onSecondCall()
      .returns(Promise.resolve({ text: () => nonWrapperAd }));

  const adChain = await adsLoader({}, 'http://example.com/');
  const expectedWrapperAd = await vastxml2js(wrapperAd);
  const expectedNonWrapperAd = await vastxml2js(nonWrapperAd);
  t.deepEqual(adChain, [expectedWrapperAd, expectedNonWrapperAd]);
});

test('must fail if the custom validation fails the ad', async (t) => {
  const wrapperAd = createAsXml([{ type: 'wrapper', uri: 'http://example.com' }]);
  const nonWrapperAd = createAsXml([{ type: 'ad' }]);

  root.fetch
    .onFirstCall()
      .returns(Promise.resolve({ text: () => wrapperAd }))
    .onSecondCall()
      .returns(Promise.resolve({ text: () => nonWrapperAd }));

  const validate = () => Promise.reject('Failed Validation');
  return adsLoader({ validate }, 'http://example.com/')
    .catch(errors =>
      t.deepEqual(errors, ['Failed Validation'])
    );
});

test.serial('must do all the waterfalls to get a valid ad', async (t) => {
  const vastWaterfall = createAsXml([
    { type: 'wrapper', uri: 'http://example.com/0' },
    { type: 'wrapper', uri: 'http://example.com/1' },
  ]);
  const nonWrapperAd = createAsXml([{ type: 'ad' }]);

  root.fetch
    .onCall(0)
      .returns(Promise.resolve({ text: () => vastWaterfall }))
    .onCall(1)
      .returns(Promise.resolve({ text: () => 'NOT XML' }))
    .onCall(2)
      .returns(Promise.resolve({ text: () => nonWrapperAd }));

  const adChain = await adsLoader({}, 'http://example.com/');
  const jsVastWaterfall = await vastxml2js(vastWaterfall);
  const normalisedWaterfall = normaliseWaterfall(jsVastWaterfall);
  const expectedNonWrapperAd = await vastxml2js(nonWrapperAd);
  t.is(root.fetch.callCount, 3);
  t.deepEqual(adChain, [normalisedWaterfall[1], expectedNonWrapperAd]);
});

test.serial('must fail if the waterfall fails', async (t) => {
  const vastWaterfall = createAsXml([
    { type: 'wrapper', uri: 'http://example.com/0' },
    { type: 'wrapper', uri: 'http://example.com/1' },
    { type: 'wrapper', uri: 'http://example.com/2' },
  ]);
  const wrapperAd = createAsXml([{ type: 'wrapper', uri: 'http://example.com/' }]);
  const nonWrapperAd = createAsXml([{ type: 'ad' }]);

  root.fetch
    .onCall(0)
      .returns(Promise.resolve({ text: () => vastWaterfall }))
    .onCall(1)
      .returns(Promise.resolve({ text: () => wrapperAd }))
    .onCall(2)
      .returns(Promise.resolve({ text: () => wrapperAd })) // First Error : maxChainDepth Reached
    .onCall(3)
      .returns(Promise.resolve({ text: () => 'NOT XML' })) // Second Error: non XML returned
    .onCall(4)
      .returns(Promise.resolve({ text: () => wrapperAd }))
    .onCall(5)
      .returns(Promise.resolve({ text: () => nonWrapperAd }));

  return adsLoader({
    maxChainDepth: 2,
    validate: () => Promise.reject(new Error('Failed Validation')),
  }, 'http://example.com/')
  .catch((errors) => {
    console.log();
    t.deepEqual(errors.map(e => e.message), [
      'VastWrapperChain \'maxChainDepth\' reached',
      'Non-whitespace before first tag.\nLine: 0\nColumn: 1\nChar: N',
      'Failed Validation',
    ]);
  });
});
