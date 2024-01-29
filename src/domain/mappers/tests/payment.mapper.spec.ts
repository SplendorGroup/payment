import { PaymentValuesObject } from '../../../domain/values-object/payment.values-object';
import { PaymentMapper } from '../payment.mapper';

describe('PaymentMapper', () => {
  describe('ProcessResponse', () => {
    it('should map data correctly', () => {
      const testData = {
        id: '123',
        order_id: '456',
        items: [
          {
            product: 'Product A',
            quantity: 2,
            price: 10,
            order_id: '456',
          },
          {
            product: 'Product B',
            quantity: 1,
            price: 20,
            order_id: '456',
          },
        ],
        date_created: '2024-01-01',
        date_approved: '2024-01-02',
        date_last_updated: '2024-01-03',
        date_of_expiration: '2024-01-04',
        payment_method: {
          id: 'pix',
        },
        status: 'approved',
        currency_id: 'USD',
        description: 'Payment for Order 456',
        transaction_amount: 50,
        point_of_interaction: {
          transaction_data: {
            qr_code: 'QR_CODE_STRING',
            qr_code_base64: 'QR_CODE_BASE64_STRING',
            ticket_url: 'https://example.com/ticket',
          },
        },
      } as any;

      const result = PaymentMapper.ProcessResponse(testData);

      expect(result).toEqual({
        id: '123',
        order_id: '456',
        date_created: '2024-01-01',
        date_approved: '2024-01-02',
        date_last_updated: '2024-01-03',
        date_of_expiration: '2024-01-04',
        payment_method: 'pix',
        status: 'APPROVED',
        currency: 'USD',
        description: 'Payment for Order 456',
        transaction_amount: PaymentValuesObject.Money(50),
        items: [
          { product: 'Product A', quantity: 2, price: 10 },
          { product: 'Product B', quantity: 1, price: 20 },
        ],
        payment_url: 'https://example.com/ticket',
        qr_code: 'QR_CODE_STRING',
        qr_code_base64: 'QR_CODE_BASE64_STRING',
      });
    });

    it('should handle null or undefined values', () => {
      const testData = {
        id: null,
        order_id: '456',
        items: [
          {
            product: 'Product A',
            quantity: 2,
            price: 10,
            order_id: '456',
          },
          {
            product: 'Product B',
            quantity: 1,
            price: 20,
            order_id: '456',
          },
        ],
        date_created: undefined,
        date_approved: '2024-01-02',
        date_last_updated: null,
        date_of_expiration: '2024-01-04',
        payment_method: undefined,
        status: 'approved',
        currency_id: 'USD',
        description: 'Payment for Order 456',
        transaction_amount: 50,
        point_of_interaction: {
          transaction_data: {
            qr_code: 'QR_CODE_STRING',
            qr_code_base64: null,
            ticket_url: 'https://example.com/ticket',
          },
        },
      } as any;

      const result = PaymentMapper.ProcessResponse(testData);

      expect(result).toEqual({
        id: null,
        order_id: '456',
        date_created: undefined,
        date_approved: '2024-01-02',
        date_last_updated: null,
        date_of_expiration: '2024-01-04',
        payment_method: undefined,
        status: 'APPROVED',
        currency: 'USD',
        description: 'Payment for Order 456',
        transaction_amount: PaymentValuesObject.Money(50),
        items: [
          { product: 'Product A', quantity: 2, price: 10 },
          { product: 'Product B', quantity: 1, price: 20 },
        ],
        payment_url: 'https://example.com/ticket',
        qr_code: 'QR_CODE_STRING',
        qr_code_base64: null,
      });
    });
  });

  describe('ViewResponse', () => {
    it('should map data correctly', () => {
      const testData = {
        id: '123',
        order_id: '456',
        items: [
          {
            product: 'Product A',
            quantity: 2,
            price: 10,
            order_id: '456',
          },
          {
            product: 'Product B',
            quantity: 1,
            price: 20,
            order_id: '456',
          },
        ],
        date_created: '2024-01-01',
        date_approved: '2024-01-02',
        date_last_updated: '2024-01-03',
        date_of_expiration: '2024-01-04',
        payment_method: {
          id: 'pix',
        },
        status: 'approved',
        currency_id: 'USD',
        description: 'Payment for Order 456',
        transaction_amount: 50,
        point_of_interaction: {
          transaction_data: {
            qr_code: 'QR_CODE_STRING',
            qr_code_base64: 'QR_CODE_BASE64_STRING',
            ticket_url: 'https://example.com/ticket',
          },
        },
      };

      const result = PaymentMapper.ProcessResponse(testData as any);

      expect(result).toEqual({
        id: '123',
        order_id: '456',
        date_created: '2024-01-01',
        date_approved: '2024-01-02',
        date_last_updated: '2024-01-03',
        date_of_expiration: '2024-01-04',
        payment_method: 'pix',
        status: 'APPROVED',
        currency: 'USD',
        description: 'Payment for Order 456',
        transaction_amount: PaymentValuesObject.Money(50),
        items: [
          { product: 'Product A', quantity: 2, price: 10 },
          { product: 'Product B', quantity: 1, price: 20 },
        ],
        payment_url: 'https://example.com/ticket',
        qr_code: 'QR_CODE_STRING',
        qr_code_base64: 'QR_CODE_BASE64_STRING',
      });
    });

    it('should handle null or undefined values', () => {
      const testData = {
        id: null,
        order_id: '456',
        items: [
          {
            product: 'Product A',
            quantity: 2,
            price: 10,
            order_id: '456',
          },
          {
            product: 'Product B',
            quantity: 1,
            price: 20,
            order_id: '456',
          },
        ],
        date_created: undefined,
        date_approved: '2024-01-02',
        date_last_updated: null,
        date_of_expiration: '2024-01-04',
        payment_method: undefined,
        status: 'approved',
        currency_id: 'USD',
        description: 'Payment for Order 456',
        transaction_amount: 50,
        point_of_interaction: {
          transaction_data: {
            qr_code: 'QR_CODE_STRING',
            qr_code_base64: null,
            ticket_url: 'https://example.com/ticket',
          },
        },
      } as any;

      const result = PaymentMapper.ProcessResponse(testData);

      expect(result).toEqual({
        id: null,
        order_id: '456',
        date_created: undefined,
        date_approved: '2024-01-02',
        date_last_updated: null,
        date_of_expiration: '2024-01-04',
        payment_method: undefined,
        status: 'APPROVED',
        currency: 'USD',
        description: 'Payment for Order 456',
        transaction_amount: PaymentValuesObject.Money(50),
        items: [
          { product: 'Product A', quantity: 2, price: 10 },
          { product: 'Product B', quantity: 1, price: 20 },
        ],
        payment_url: 'https://example.com/ticket',
        qr_code: 'QR_CODE_STRING',
        qr_code_base64: null,
      });
    });
  });

  describe('GetStatusResponse', () => {
    it('should map status correctly', () => {
      const testData = {
        order_id: '789',
        status: 'rejected',
      };

      const result = PaymentMapper.GetStatusResponse(testData as any);

      expect(result).toEqual({
        order_id: '789',
        status: 'rejected',
      });
    });

    it('should handle null or undefined values', () => {
      const testData = {
        order_id: '789',
        status: null,
      };

      const result = PaymentMapper.GetStatusResponse(testData as any);

      expect(result).toEqual({
        order_id: '789',
        status: null,
      });
    });
  });
});
