jest.mock(
  '@folio/stripes/smart-components',
  () => ({
    ...jest.requireActual('@folio/stripes/smart-components'),
    LocationLookup: () => <div>LocationLookup</div>,
    NotesSmartAccordion: () => <div>NotesSmartAccordion</div>,
    ViewMetaData: () => <div>ViewMetaData</div>,
  }),
  { virtual: true }
);
