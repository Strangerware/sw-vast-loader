import test from 'ava';
import { isVastWrapper, getVastTagUri } from '../src/selectors';

const vastWrapperObj = {
  vast: {
    ad: {
      wrapper: {
        vasttaguri: 'http://expample.com',
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
  t.is(getVastTagUri(vastWrapperObj), 'http://expample.com'));

test('getVastTagUri must return undefined if vastTagUri can not be found', (t) => {
  t.is(getVastTagUri(nonVastWrapperObj), undefined);
  t.is(getVastTagUri(), undefined);
  t.is(getVastTagUri(null), undefined);
  t.is(getVastTagUri('nonVastWrapperObj'), undefined);
  t.is(getVastTagUri(() => {}), undefined);
});
