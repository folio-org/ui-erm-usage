import {
  isValidUrl,
  requiredValidDate,
  year,
} from './validate';

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

describe('requiredValidDate function', () => {
  test('returns undefined for a non-empty value', () => {
    expect(requiredValidDate('2026-10-07')).toBeUndefined();
  });

  test('returns the valid-date message for empty values', () => {
    [undefined, null, ''].forEach((value) => {
      expect(requiredValidDate(value).props.id).toBe('ui-erm-usage.errors.enterValidDate');
    });
  });
});

describe('year validation', () => {
  // test for numbers and strings, since final-form returns the value of the field as a string
  it('should return undefined for min, max and other valid years', () => {
    [1000, 2999, 2026, '1000', '2999', '2026'].forEach((value) => {
      expect(year(value)).toBeUndefined();
    });
  });

  it('should return the year-invalid message for invalid years', () => {
    ['0999', '3000', '999', '20260', '202a', ' 2026', '2026-01', 'abcd'].forEach((value) => {
      expect(year(value).props.id).toBe('ui-erm-usage.errors.yearInvalid');
    });
  });

  it('should return undefined for empty values', () => {
    [undefined, null, ''].forEach((value) => {
      expect(year(value)).toBeUndefined();
    });
  });
});
