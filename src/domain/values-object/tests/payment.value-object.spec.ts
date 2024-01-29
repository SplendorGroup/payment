import { PaymentValuesObject } from '../payment.values-object';

describe('PaymentValuesObject', () => {
  describe('Money', () => {
    it('should format positive number correctly with default currency and locale', () => {
      const result = PaymentValuesObject.Money(123.45);

      expect(result).toBe('R$ 123,45');
    });

    it('should format positive number correctly with custom currency and locale', () => {
      const result = PaymentValuesObject.Money(123.45, 'USD', 'en-US');

      expect(result).toBe('$123.45');
    });

    it('should format negative number correctly with default currency and locale', () => {
      const result = PaymentValuesObject.Money(-123.45);

      expect(result).toBe('-R$ 123,45');
    });

    it('should format zero correctly with default currency and locale', () => {
      const result = PaymentValuesObject.Money(0);

      expect(result).toBe('R$ 0,00');
    });

    it('should handle null or undefined input as zero and format correctly', () => {
      const resultNull = PaymentValuesObject.Money(null);

      expect(resultNull).toBe('R$ 0,00');

      const resultUndefined = PaymentValuesObject.Money(undefined);

      expect(resultUndefined).toBe('R$ 0,00');
    });

    it('should handle invalid input as zero and format correctly', () => {
      const resultInvalid = PaymentValuesObject.Money('invalid' as any);

      expect(resultInvalid).toBe('R$ 0,00');
    });
  });
});
