import extractHarvesterImpls, {
  getImplementations,
  isServiceTypeSupported,
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
});
