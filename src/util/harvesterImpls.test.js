import extractHarvesterImpls, {
  getImplementations,
  getUnsupportedServiceTypeName,
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
    test.each([undefined, null, [], [{}]])('should return empty array for %p', (input) => {
      expect(getImplementations(input)).toEqual([]);
    });

    test('should return implementations of first record', () => {
      expect(getImplementations(records)).toBe(records[0].implementations);
    });
  });

  describe('extractHarvesterImpls', () => {
    test('should map implementations to select options with empty first option', () => {
      expect(extractHarvesterImpls(records)).toEqual([
        { value: undefined, label: '' },
        { value: 'cs50', label: 'Counter 5.0' },
        { value: 'cs51', label: 'Counter 5.1' },
      ]);
    });

    test('should return only empty option if no records are loaded', () => {
      expect(extractHarvesterImpls([])).toEqual([{ value: undefined, label: '' }]);
    });
  });

  describe('isServiceTypeSupported', () => {
    test('should return true for a provided service type', () => {
      expect(isServiceTypeSupported(records, 'cs51')).toBe(true);
    });

    test('should return false for a service type that is not provided', () => {
      expect(isServiceTypeSupported(records, 'cs41')).toBe(false);
    });

    test.each([undefined, ''])('should return true if service type is %p', (serviceType) => {
      expect(isServiceTypeSupported(records, serviceType)).toBe(true);
    });

    test('should return true while implementations are not loaded', () => {
      expect(isServiceTypeSupported([], 'cs41')).toBe(true);
    });
  });

  describe('getUnsupportedServiceTypeName', () => {
    test('should return known name of unsupported service type', () => {
      expect(getUnsupportedServiceTypeName('cs41')).toBe('Counter-Sushi 4.1');
    });

    test('should fall back to service type code', () => {
      expect(getUnsupportedServiceTypeName('cs99')).toBe('cs99');
    });
  });
});
