import test from 'ava';
import sinon from 'sinon';
import root from 'window-or-global';
import fetchAd from '../src/fetchAd';

const xmlExample = () => `
<?xml version="1.0"?>
<VAST version="4.0">
  <Ad id="static">
  </Ad>
</VAST>
`;

const fakeResponse = ({ text }) => ({
  text() {
    return text;
  },
});

test.beforeEach(() => sinon.stub(root, 'fetch').returns(
  Promise.resolve(fakeResponse({ text: xmlExample() })))
);
test.afterEach(() => root.fetch.restore());

test.serial('must return a promise', t => t.true(fetchAd({}, '') instanceof Promise));

test.serial('must fetch the ad using the videoAdTag endpoint', (t) => {
  const videoAdTag = 'http://example.com/';
  fetchAd({}, videoAdTag);
  t.true(root.fetch.calledOnce);
  t.true(root.fetch.calledWith(videoAdTag, sinon.match.object));
});

test.serial('must use the config to customise the fetch', (t) => {
  const config = {};
  fetchAd(config, 'http://example.com/');
  t.true(root.fetch.calledOnce);
  t.true(root.fetch.calledWith(sinon.match.string, sinon.match({ ...config })));
});

test.serial('must reject the promise if the body is not XML', (t) => {
  root.fetch.returns(
    Promise.resolve(fakeResponse({ text: 'notXML' }))
  );
  t.throws(fetchAd({}, 'http://example.com/'));
});

test.serial('must resolve the promise with the body as an object', t =>
  fetchAd({}, 'http://example.com/')
    .then(result => t.true(typeof result === 'object'))
);
