import React from 'react';
import { FormattedMessage } from 'react-intl';

import { isValidURL } from './validate';

describe('isValidURL function', () => {
  test('validates URLs correctly', () => {
    const urls = [
      { input: 'https://example.com', expected: undefined },
      { input: 'http://example.com', expected: undefined },
      { input: 'file://localhost/path/to/file', expected: undefined },
      { input: 'file://127.0.0.1/path/to/file', expected: undefined },
      { input: 'ftp://user:pass@example.com/file.txt', expected: undefined },
      { input: 'ftp://127.0.0.1/file.txt', expected: undefined },
      { input: 'invalid-example-url', expected: <FormattedMessage id="ui-erm-usage.errors.enterValidUrl" /> },
      { input: '', expected: <FormattedMessage id="ui-erm-usage.errors.enterValidUrl" /> },
    ];

    const results = urls.map(({ input }) => ({
      input,
      result: isValidURL(input),
    }));

    const expectedResults = urls.map(({ input, expected }) => ({
      input,
      result: expected,
    }));

    expect(results).toEqual(expectedResults);
  });
});
