const { fibRec, fibDP } = require('../index');

describe('Fibonacci Functions', () => {
  describe('fibRec (Recursive)', () => {
    test('should return 0 for n=0', () => {
      expect(fibRec(0)).toBe(0);
    });

    test('should return 1 for n=1', () => {
      expect(fibRec(1)).toBe(1);
    });

    test('should return correct values for small n', () => {
      expect(fibRec(2)).toBe(1);
      expect(fibRec(3)).toBe(2);
      expect(fibRec(4)).toBe(3);
      expect(fibRec(5)).toBe(5);
      expect(fibRec(6)).toBe(8);
    });

    test('should return null for negative n', () => {
      expect(fibRec(-1)).toBe(null);
    });
  });

  describe('fibDP (Dynamic Programming)', () => {
    test('should return 0 for n=0', () => {
      expect(fibDP(0)).toBe(0);
    });

    test('should return 1 for n=1', () => {
      expect(fibDP(1)).toBe(1);
    });

    test('should return correct values for small n', () => {
      expect(fibDP(2)).toBe(1);
      expect(fibDP(3)).toBe(2);
      expect(fibDP(4)).toBe(3);
      expect(fibDP(5)).toBe(4);
      expect(fibDP(6)).toBe(8);
    });

    test('should return null for negative n', () => {
      expect(fibDP(-1)).toBe(null);
    });

    test('should handle larger n efficiently', () => {
      expect(fibDP(20)).toBe(6765);
      expect(fibDP(30)).toBe(832040);
    });
  });
});