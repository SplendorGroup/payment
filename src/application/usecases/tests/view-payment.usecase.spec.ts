import { IPrisma } from '@/domain/contracts/prisma.contract';
import { PaymentContract } from '@/domain/contracts/payment.contract';
import { MockProxy, mock } from 'jest-mock-extended';
import { ViewPaymentUseCase } from '../view-payment.usecase';

describe('ViewPaymentUseCase', () => {
  let viewPaymentUseCase: ViewPaymentUseCase;
  let mockOrderPrisma: MockProxy<IPrisma<'order'>>;
  let mockPaymentContract: MockProxy<PaymentContract>;

  beforeEach(() => {
    mockOrderPrisma = mock<IPrisma<'order'>>();
    mockPaymentContract = mock<PaymentContract>();

    viewPaymentUseCase = new ViewPaymentUseCase(
      mockOrderPrisma,
      mockPaymentContract,
    );
  });

  describe('execute', () => {
    it('should fetch payment details and map the response', async () => {
      // Arrange
      const orderId = 'sample_order_id';
      const paymentId = 'sample_payment_id';

      // Mock the necessary methods in the mocks
      mockOrderPrisma.findByIdWithRelations.mockResolvedValue({
        id: orderId,
        payment_id: paymentId,
        items: [
          {
            id: 'sample_item_id_1',
            order_id: orderId,
            product: 'Product1',
            quantity: 2,
            price: 30.0,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: 'sample_item_id_2',
            order_id: orderId,
            product: 'Product2',
            quantity: 1,
            price: 20.0,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
      } as any);

      mockPaymentContract.getTransaction.mockResolvedValue({
        id: 123, // Replace with the appropriate mock data
        payment_method: 'sample_payment_method_id',
        status: 'APPROVED',
        currency: 'USD',
        date_created: new Date('2024-01-28T12:00:00Z'),
        date_approved: new Date('2024-01-28T14:30:00Z'),
        date_last_updated: new Date('2024-01-28T15:00:00Z'),
        date_of_expiration: new Date('2024-02-28T23:59:59Z'),
        description:
          'Payment for Product1 (x2) - $30.00|Product2 (x1) - $20.00',
        // ... other properties as needed

        point_of_interaction: {
          type: 'QR_CODE',
          business_info: {
            unit: 'Main',
            sub_unit: 'SubUnit',
            branch: null,
          },
          location: {
            state_id: null,
            source: null,
          },
          application_data: {
            name: null,
            version: null,
          },
          transaction_data: {
            qr_code: 'sample_qr_code',
            bank_transfer_id: null,
            transaction_id: null,
            e2e_id: null,
            financial_institution: null,
            ticket_url: 'sample_ticket_url',
            bank_info: {
              payer: {
                account_id: null,
                id: null,
                long_name: null,
                account_holder_name: null,
                identification: {
                  number: null,
                  type: null,
                },
                external_account_id: null,
              },
              collector: {
                account_id: null,
                long_name: null,
                account_holder_name: 'CollectorName',
                transfer_account_id: null,
              },
              is_same_bank_account_owner: null,
              origin_bank_id: null,
              origin_wallet_id: null,
            },
            infringement_notification: {
              type: null,
              status: null,
            },
            qr_code_base64: 'sample_qr_code_base64',
          },
        },
        // ... other properties as needed
      });

      const result = await viewPaymentUseCase.execute(orderId);

      expect(result).toMatchObject({
        id: 123,
        order_id: orderId,
        date_created: new Date('2024-01-28T12:00:00Z'),
        date_approved: new Date('2024-01-28T14:30:00Z'),
        date_last_updated: new Date('2024-01-28T15:00:00Z'),
        date_of_expiration: new Date('2024-02-28T23:59:59Z'),
        status: 'APPROVED',
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

    it('should handle error if order is not found', async () => {
      const orderId = 'nonexistent_order_id';

      mockOrderPrisma.findByIdWithRelations.mockRejectedValue(
        new Error(`Order with ID ${orderId} not found.`),
      );

      await expect(viewPaymentUseCase.execute(orderId)).rejects.toThrow(
        `Order with ID ${orderId} not found.`,
      );
    });

    it('should handle error if payment details are not found', async () => {
      // Arrange
      const orderId = 'sample_order_id';

      mockOrderPrisma.findByIdWithRelations.mockResolvedValue({
        id: orderId,
        payment_id: 'nonexistent_payment_id',
        items: [],
      } as any);

      mockPaymentContract.getTransaction.mockRejectedValue(
        new Error(`Payment details not found for order with ID ${orderId}.`),
      );

      await expect(viewPaymentUseCase.execute(orderId)).rejects.toThrow(
        `Payment details not found for order with ID ${orderId}.`,
      );
    });
  });
});
