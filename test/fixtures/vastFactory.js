import vastxml2js from '../../src/vastxml2js';

const types = {
  wrapper: ({ id, uri = 'http://example.com/' }) => `
    <Ad id="${id}">
      <Wrapper fallbackOnNoAd="true">
        <AdSystem>GDFP</AdSystem>
        <VASTAdTagURI><![CDATA[${uri}]]></VASTAdTagURI>
      </Wrapper>
    </Ad>
  `,
  ad: ({ id, title = 'Test Ad Video' }) => `
    <Ad id="${id}">
      <InLine>
        <AdSystem>GDFP</AdSystem>
        <AdTitle>${title}</AdTitle>
      </InLine>
    </Ad>
  `,
};

export const createAsXml = (vastAdTagURIs = []) => {
  const waterfall = vastAdTagURIs
    .map(
      ({ uri, type, title }, id) => types[type]({ uri, id, title })
    ).join('');

  return `
    <?xml version="1.0" encoding="UTF-8"?>
    <VAST xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="vast.xsd" version="3.0">
    ${waterfall}
    </VAST>
  `;
};

export const createAsJs = (vastAdTagURIs = []) => vastxml2js(createAsXml(vastAdTagURIs));
