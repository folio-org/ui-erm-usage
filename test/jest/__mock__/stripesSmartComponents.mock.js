import React from 'react';

jest.mock(
  '@folio/stripes/smart-components',
  () => ({
    ...jest.requireActual('@folio/stripes/smart-components'),
    LocationLookup: () => <div>LocationLookup</div>,
    NotesSmartAccordion: () => <div>NotesSmartAccordion</div>,
    ViewMetaData: () => <div>ViewMetaData</div>,
    // StripesConnectedSource: () => jest.fn().mockImplementation(() => {
    //   return { totalCount: jest.fn() };
    // })
  }),
  { virtual: true }
);
