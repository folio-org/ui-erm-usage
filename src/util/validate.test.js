import { isValidUrl } from './validate';

describe('isValidUrl function', () => {
  test('validates URLs correctly', () => {
    const urls = [
      { input: 'https://example.com', expected: true },
      { input: 'http://example.com', expected: true },
      { input: 'file://localhost/path/to/file', expected: true },
      { input: 'file://127.0.0.1/path/to/file', expected: true },
      { input: 'ftp://user:pass@example.com/file.txt', expected: true },
      { input: 'ftp://127.0.0.1/file.txt', expected: true },
      { input: 'invalid-example-url', expected: false },
      { input: '', expected: false },
    ];

    urls.forEach(({ input, expected }) => {
      expect(isValidUrl(input)).toBe(expected);
    });
  });
});
