import test from 'ava';
import sinon from 'sinon';
import vastWrapperChain from '../src/wrapperChain';
import { createAsJs } from './fixtures/vastFactory';

const vastWrapperObj = (uri = 'http://example.com/') => createAsJs([{
  uri,
  type: 'wrapper',
}]);

const nonVastWrapperObj = () => createAsJs([{ type: 'ad' }]);

test('must return a promise', t =>
  t.true(
    vastWrapperChain(
      () => Promise.resolve(), {}, 'http://example.com/'
    ) instanceof Promise
  )
);

test('must fetch the ad', async (t) => {
  const fetchAd = sinon.stub().returns(Promise.resolve());
  const videoAdTag = 'http://example.com/';
  const vastAd = await vastWrapperObj(videoAdTag);
  await vastWrapperChain(fetchAd, {}, vastAd);
  t.true(fetchAd.calledOnce);
  t.true(fetchAd.calledWith(videoAdTag));
});

test('must recursively fetch ads until it gets a non wrapper ad', async (t) => {
  const fetchAd = sinon.stub();

  fetchAd
    .onFirstCall()
      .returns(Promise.resolve(vastWrapperObj('http://example.com/1')))
    .onSecondCall()
      .returns(Promise.resolve(vastWrapperObj('http://example.com/2')))
    .onThirdCall()
      .returns(Promise.resolve(nonVastWrapperObj()));

  const vastAd = await vastWrapperObj('http://example.com/');

  await vastWrapperChain(fetchAd, {}, vastAd);
  t.true(fetchAd.calledThrice);
  t.true(fetchAd.firstCall.calledWith('http://example.com/'));
  t.true(fetchAd.secondCall.calledWith('http://example.com/1'));
  t.true(fetchAd.thirdCall.calledWith('http://example.com/2'));
});

test('must reject the promise if there is a problem fetching the ad', async (t) => {
  const fetchAd = sinon.stub();
  const vastAd = await vastWrapperObj('http://example.com/');

  fetchAd.returns(Promise.reject(new Error('Problem fetching the ad')));
  t.throws(
    vastWrapperChain(
      fetchAd, {}, vastAd
    ), 'Problem fetching the ad');
});

test('must reject the promise if "maxChainDepth" is reached', async (t) => {
  const config = { maxChainDepth: 4 };
  const fetchAd = sinon.stub();
  const vastAd = await vastWrapperObj('http://example.com/1');

  const expected = await Promise.all([
    vastWrapperObj('http://example.com/1'),
    vastWrapperObj('http://example.com/2'),
    vastWrapperObj('http://example.com/2'),
    vastWrapperObj('http://example.com/2'),
    vastWrapperObj('http://example.com/2'),
  ]);

  fetchAd.returns(vastWrapperObj('http://example.com/2'));
  return vastWrapperChain(fetchAd, config, vastAd)
    .catch((err) => {
      t.is(fetchAd.callCount, config.maxChainDepth);
      t.true(err instanceof Error);
      t.is(err.message, 'VastWrapperChain \'maxChainDepth\' reached');
      t.deepEqual(err.adChain, expected);
    });
});

test('must resolve with an array of all the chained wrappers and the ad', async (t) => {
  const fetchAd = sinon.stub();
  const vastAd = await vastWrapperObj('http://example.com/');

  fetchAd
    .onFirstCall()
      .returns(Promise.resolve(vastWrapperObj('http://example.com/1')))
    .onSecondCall()
      .returns(Promise.resolve(vastWrapperObj('http://example.com/2')))
    .onThirdCall()
      .returns(Promise.resolve(nonVastWrapperObj()));

  const expected = await Promise.all([
    vastWrapperObj('http://example.com/'),
    vastWrapperObj('http://example.com/1'),
    vastWrapperObj('http://example.com/2'),
    nonVastWrapperObj(),
  ]);

  const adChain = await vastWrapperChain(fetchAd, {}, vastAd);

  t.deepEqual(adChain, expected);
});

test('must resolve with the ad if the passed vastAdObj is a nonWrapper ad', async (t) => {
  const fetchAd = sinon.stub();
  const vastAd = nonVastWrapperObj();
  const adChain = await vastWrapperChain(fetchAd, {}, vastAd);

  t.true(fetchAd.notCalled);
  t.deepEqual(adChain, [vastAd]);
});
