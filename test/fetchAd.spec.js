import test from 'ava';
import sinon from 'sinon';
import fetchAd from '../src/fetchAd';
import root from 'window-or-global';

const xmlExample = () => `
<?xml version="1.0"?>
<VAST version="4.0">
  <Ad id="static">
  </Ad>
</VAST>
`;

const fakeResponse = ({text}) => ({
  text() {
    return text;
  }
});

test.beforeEach(() => sinon.stub(root, 'fetch').returns(
  Promise.resolve(fakeResponse({ text: xmlExample() })))
);
test.afterEach(() => root.fetch.restore());

test.serial('must return a promise', t => t.true(fetchAd() instanceof Promise));

test.serial('must fetch the ad using the masterAdTag endpoint', t => {
  const masterAdTag = 'http://example.com/';
  fetchAd(masterAdTag);
  t.true(root.fetch.calledOnce);
  t.true(root.fetch.calledWith(masterAdTag, sinon.match.object));
});

test.serial('must use the config to customise the fetch', t => {
  const config = {};
  fetchAd('http://example.com/', config);
  t.true(root.fetch.calledOnce);
  t.true(root.fetch.calledWith(sinon.match.string, sinon.match({...config})));
});

test.serial('must reject the promise if the body is not XML', t => {
  root.fetch.returns(
    Promise.resolve(fakeResponse({ text: 'notXML' }))
  );
  t.throws(fetchAd('http://example.com/'));
});

test.serial('must resolve the promise with the body as an object', t =>
  fetchAd('http://example.com/')
    .then((result) => t.true(typeof result === 'object'))
);