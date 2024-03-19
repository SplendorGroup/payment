import { IPrisma } from '@/domain/contracts/prisma.contract';
import { PaymentContract } from '@/domain/contracts/payment.contract';

import { MockProxy, mock } from 'jest-mock-extended';
import { ProcessPaymentUseCase } from '../process-payment.usecase';
import { PaymentProcessDTO } from '@/application/dtos/payment.process.dto';
import { IdentificationType } from '../../../domain/enum/identification-type.enum';

describe('ProcessPaymentUseCase', () => {
  let processPaymentUseCase: ProcessPaymentUseCase;
  let mockOrderPrisma: MockProxy<IPrisma<'order'>>;
  let mockItemPrisma: MockProxy<IPrisma<'item'>>;
  let mockPaymentContract: MockProxy<PaymentContract>;

  beforeEach(() => {
    mockOrderPrisma = mock<IPrisma<'order'>>();
    mockItemPrisma = mock<IPrisma<'item'>>();
    mockPaymentContract = mock<PaymentContract>();

    processPaymentUseCase = new ProcessPaymentUseCase(
      mockOrderPrisma,
      mockItemPrisma,
      mockPaymentContract,
    );
  });

  describe('execute', () => {
    it('should process payment and create order and items', async () => {
      // Arrange
      const paymentProcessData: PaymentProcessDTO = {
        payerFirstName: 'John',
        payerLastName: 'Doe',
        idempotent_key: '1234567890',
        email: 'john.doe@example.com',
        identificationType: IdentificationType.CPF,
        identificationNumber: '12345678909',
        items: [
          { product: 'Product1', quantity: 2, price: 30.0 },
          { product: 'Product2', quantity: 1, price: 20.0 },
        ],
      };

      const mockOrderData = {
        id: 'sample_order_id',
        payment_id: 'sample_payment_id',
        status: 'PENDING',
        value: 100.0,
        created_at: new Date(),
        updated_at: new Date(),
        items: [
          {
            id: 'sample_item_id_1',
            order_id: 'sample_order_id',
            product: 'Product1',
            quantity: 2,
            price: 30.0,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: 'sample_item_id_2',
            order_id: 'sample_order_id',
            product: 'Product2',
            quantity: 1,
            price: 20.0,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
      };

      const mockPaymentData = {
        id: 'sample_payment_id',
        order_id: 'sample_order_id',
        date_created: new Date(),
        date_approved: new Date(),
        date_last_updated: new Date(),
        date_of_expiration: new Date(),
        payment_method: { id: 'sample_payment_method_id' },
        status: 'APPROVED',
        currency_id: 'USD',
        description:
          'Payment for Product1 (x2) - $30.00|Product2 (x1) - $20.00',
        transaction_amount: 100.0,
        point_of_interaction: {
          transaction_data: {
            qr_code: 'sample_qr_code',
            qr_code_base64: 'sample_qr_code_base64',
            ticket_url: 'sample_ticket_url',
          },
        },
      } as any;

      mockOrderPrisma.create.mockResolvedValue(mockOrderData as any);
      mockItemPrisma.createMany.mockResolvedValue(mockOrderData.items as any);
      mockPaymentContract.process.mockResolvedValue(mockPaymentData);
      mockOrderPrisma.update.mockResolvedValue(null);

      const result = await processPaymentUseCase.execute(paymentProcessData);

      expect(result).toMatchObject({
        id: 'sample_payment_id',
        order_id: 'sample_order_id',
        date_created: expect.any(Date),
        date_approved: expect.any(Date),
        date_last_updated: expect.any(Date),
        date_of_expiration: expect.any(Date),
        payment_method: 'sample_payment_method_id',
        status: 'APPROVED',
        currency: 'USD',
        description:
          'Payment for Product1 (x2) - $30.00|Product2 (x1) - $20.00',
        items: [
          { product: 'Product1', quantity: 2, price: 30.0 },
          { product: 'Product2', quantity: 1, price: 20.0 },
        ],
        payment_url: 'sample_ticket_url',
        qr_code: 'sample_qr_code',
        qr_code_base64: 'sample_qr_code_base64',
      });
    });

    it('should handle errors and return appropriate response', async () => {
      const paymentProcessData: PaymentProcessDTO = {
        payerFirstName: 'John',
        payerLastName: 'Doe',
        idempotent_key: '1234567890',
        email: 'john.doe@example.com',
        identificationType: IdentificationType.CPF,
        identificationNumber: '12345678909',
        items: [
          { product: 'Product1', quantity: 2, price: 30.0 },
          { product: 'Product2', quantity: 1, price: 20.0 },
        ],
      };

      mockOrderPrisma.create.mockRejectedValue(
        new Error('Order creation failed'),
      );

      await expect(
        processPaymentUseCase.execute(paymentProcessData),
      ).rejects.toThrow('Order creation failed');
    });
  });
});
