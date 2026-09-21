import extractHarvesterImpls, {
  formatUnsupportedLabel,
  getImplementations,
  isServiceTypeSupported,
  splitHarvesterImpls,
} from './harvesterImpls';

const records = [
  {
    implementations: [
      { type: 'cs50', name: 'Counter 5.0', reportRelease: '5' },
      { type: 'cs51', name: 'Counter 5.1', reportRelease: '5.1' },
    ],
  },
];

describe('harvesterImpls', () => {
  describe('getImplementations', () => {
    it('should return empty array if records are undefined, null, empty or without implementations', () => {
      expect(getImplementations(undefined)).toEqual([]);
      expect(getImplementations(null)).toEqual([]);
      expect(getImplementations([])).toEqual([]);
      expect(getImplementations([{}])).toEqual([]);
    });

    it('should return implementations of first record', () => {
      expect(getImplementations(records)).toBe(records[0].implementations);
    });
  });

  describe('extractHarvesterImpls', () => {
    it('should map implementations to select options with empty first option', () => {
      expect(extractHarvesterImpls(records)).toEqual([
        { value: undefined, label: '' },
        { value: 'cs50', label: 'Counter 5.0' },
        { value: 'cs51', label: 'Counter 5.1' },
      ]);
    });

    it('should return only empty option if no records are loaded', () => {
      expect(extractHarvesterImpls([])).toEqual([{ value: undefined, label: '' }]);
    });
  });

  describe('isServiceTypeSupported', () => {
    it('should return true for a provided service type', () => {
      expect(isServiceTypeSupported(records, 'cs51')).toBe(true);
    });

    it('should return false for a service type that is not provided', () => {
      expect(isServiceTypeSupported(records, 'cs41')).toBe(false);
    });

    it('should return true if service type is undefined or empty string', () => {
      expect(isServiceTypeSupported(records, undefined)).toBe(true);
      expect(isServiceTypeSupported(records, '')).toBe(true);
    });

    it('should return true while implementations are not loaded', () => {
      expect(isServiceTypeSupported([], 'cs41')).toBe(true);
    });

    it('should return false if no implementations are available', () => {
      expect(isServiceTypeSupported([{ implementations: [] }], 'cs41')).toBe(false);
    });
  });

  describe('splitHarvesterImpls', () => {
    it('should split implementations by isAggregator', () => {
      const nss = { type: 'NSS', name: 'Nationaler Statistikserver', isAggregator: true };
      const cs51 = { type: 'cs51', name: 'Counter 5.1', isAggregator: false };

      expect(splitHarvesterImpls([{ implementations: [nss, cs51] }])).toEqual({
        aggregatorImpls: [{ implementations: [nss] }],
        harvesterImpls: [{ implementations: [cs51] }],
      });
    });

    it.each([undefined, null, []])('should return empty records if records are %p', (emptyRecords) => {
      expect(splitHarvesterImpls(emptyRecords)).toEqual({
        aggregatorImpls: [],
        harvesterImpls: [],
      });
    });

    // the routes pass the result of splitHarvesterImpls to isServiceTypeSupported
    it('should not mark service types as unsupported while implementations are not loaded', () => {
      const { aggregatorImpls, harvesterImpls } = splitHarvesterImpls(undefined);

      expect(isServiceTypeSupported(aggregatorImpls, 'NSS')).toBe(true);
      expect(isServiceTypeSupported(harvesterImpls, 'cs41')).toBe(true);
    });

    it('should mark aggregator service types as unsupported if no aggregator implementations are loaded', () => {
      const cs51 = { type: 'cs51', name: 'Counter 5.1', isAggregator: false };
      const { aggregatorImpls, harvesterImpls } = splitHarvesterImpls([{ implementations: [cs51] }]);

      expect(isServiceTypeSupported(aggregatorImpls, 'NSS')).toBe(false);
      expect(isServiceTypeSupported(harvesterImpls, 'cs51')).toBe(true);
    });
  });

  describe('formatUnsupportedLabel', () => {
    const intl = { formatMessage: jest.fn(({ id }, { value }) => `${value} [${id}]`) };

    it('should return the label unchanged if supported', () => {
      expect(formatUnsupportedLabel(intl, 'NSS', true)).toBe('NSS');
    });

    it('should add the unsupported message if not supported', () => {
      const expected = 'NSS [ui-erm-usage.udpHarvestingConfig.unsupportedValue]';

      expect(formatUnsupportedLabel(intl, 'NSS', false)).toBe(expected);
    });
  });
});
