import test from 'ava';
import adsLoader from '../src/adsLoader';

test('must reject the promise if you don\'t pass a masterAdTag', t => t.throws(
  adsLoader(), 'adsLoader missing masterAdTag'
));
