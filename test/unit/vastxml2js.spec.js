import test from 'ava';
import VastError from 'sw-vast-errors';
import vastxml2js from '../../src/vastxml2js';
import { vast, parsedVast } from '../fixtures/vastFullSample';

const xmlSample = `
 <?xml version="1.0" encoding="UTF-8"?>
 <VAST xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="vast.xsd" version="3.0">
 </VAST>
`;

test('must return a promise', t =>
  t.true(vastxml2js(xmlSample) instanceof Promise));

test('must parse the passed xml', async (t) => {
  const result = await vastxml2js(xmlSample);
  const expected = {
    vast: {
      $: {
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:noNamespaceSchemaLocation': 'vast.xsd',
        version: '3.0',
      },
    },
  };

  t.deepEqual(result, expected);
});

test('must be able to deserialise a full vast response', async (t) => {
  const result = await vastxml2js(vast);
  t.deepEqual(result, parsedVast);
});

test('must be able to deserialise tricky URIs', async (t) => {
  const trickyXML = `
    <?xml version="1.0" encoding="UTF-8"?>
    <VAST xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="vast.xsd" version="3.0">
    <Ad>
    <Impression id="myserver"> 
        <![CDATA[http://ad.server.com/impression/dot.gif?s=x]]]]><![CDATA[>]]>x
    </Impression>
    </Ad>
    </VAST>
  `;
  const result = await vastxml2js(trickyXML);
  t.is(result.vast.ad.impression._, 'http://ad.server.com/impression/dot.gif?s=x]]>x');
});

test('on xml parsing error must reject with Vast Error 100', (t) => {
  const wrongXML = 'I AM NOT XML, I AM A JSON IN DISGUISE';
  t.throws(vastxml2js(wrongXML), (error) => {
    t.true(error instanceof VastError);
    t.is(error.errorCode, 100);
    return true;
  });
});
