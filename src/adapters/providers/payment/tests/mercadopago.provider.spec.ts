import { MockProxy, mock } from 'jest-mock-extended';
import { Payment } from 'mercadopago';
import { MercadoPagoProvider } from '../mercadopago.provider';
import { InternalServerErrorException } from '@nestjs/common';

jest.mock('mercadopago', () => ({
  MercadoPagoConfig: jest.fn(),
  Payment: jest.fn(),
}));

describe('MercadoPagoProvider', () => {
  let mercadoPagoProvider: MercadoPagoProvider;
  let mockPayment: MockProxy<Payment>;

  beforeEach(() => {
    mercadoPagoProvider = new MercadoPagoProvider();
    mockPayment = mock<Payment>();
    mercadoPagoProvider['_payment'] = mockPayment;
  });

  describe('process', () => {
    it('should return an object with an id property on successful payment processing', async () => {
      const mockResponse = {
        id: 'mockPaymentId',
      } as any;
      mockPayment.create.mockResolvedValue(mockResponse);

      const requestBody: Payment.ProcessRequest = {
        transactionAmount: 100.0,
        token: 'mockToken',
        description: 'Test Payment',
        email: 'test@example.com',
        payerFirstName: 'John',
        payerLastName: 'Doe',
        identificationType: 'CPF',
        identificationNumber: '12345678901',
      };

      const result = await mercadoPagoProvider.process(requestBody);

      expect(result).toHaveProperty('id');
    });

    it('should throw InternalServerErrorException on payment processing error', async () => {
      const mockError = new Error('Mock processing error');
      mockPayment.create.mockRejectedValue(mockError);

      const requestBody: Payment.ProcessRequest = {
        transactionAmount: 100.0,
        token: 'mockToken',
        description: 'Test Payment',
        email: 'test@example.com',
        payerFirstName: 'John',
        payerLastName: 'Doe',
        identificationType: 'CPF',
        identificationNumber: '12345678901',
      };

      await expect(
        mercadoPagoProvider.process(requestBody),
      ).rejects.toThrowError(
        new InternalServerErrorException(mockError.message),
      );
    });
  });

  describe('getTransaction', () => {
    it('should return a transaction object on successful retrieval', async () => {
      const mockResponse = {
        id: 'mockTransactionId',
      } as any;
      mockPayment.get.mockResolvedValue(mockResponse);

      const result =
        await mercadoPagoProvider.getTransaction('mockTransactionId');

      expect(result).toEqual(mockResponse);
    });

    it('should throw InternalServerErrorException on transaction retrieval error', async () => {
      const mockError = new Error('Mock retrieval error');
      mockPayment.get.mockRejectedValue(mockError);

      await expect(
        mercadoPagoProvider.getTransaction('mockTransactionId'),
      ).rejects.toThrowError(
        new InternalServerErrorException(mockError.message),
      );
    });
  });
});
