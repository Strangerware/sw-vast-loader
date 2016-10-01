import test from 'ava';
import fetchAd from '../src/fetchAd';

test(`must reject the promise if you don't pass a config obj`, t => t.throws(
  fetchAd(), Error, 'fetchAd missing config'
));
