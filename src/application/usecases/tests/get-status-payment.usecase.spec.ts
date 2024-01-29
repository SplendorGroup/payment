import { IPrisma } from '@/domain/contracts/prisma.contract';
import { PaymentContract } from '@/domain/contracts/payment.contract';
import { MockProxy, mock } from 'jest-mock-extended';
import { GetStatusPaymentUseCase } from '../get-status-payment.usecase';

describe('GetStatusPaymentUseCase', () => {
  let getStatusPaymentUseCase: GetStatusPaymentUseCase;
  let mockOrderPrisma: MockProxy<IPrisma<'order'>>;
  let mockPaymentContract: MockProxy<PaymentContract>;

  beforeEach(() => {
    mockOrderPrisma = mock<IPrisma<'order'>>();
    mockPaymentContract = mock<PaymentContract>();

    getStatusPaymentUseCase = new GetStatusPaymentUseCase(mockOrderPrisma, mockPaymentContract);
  });

  describe('execute', () => {
    it('should fetch payment status and map the response', async () => {
      const orderId = 'sample_order_id';
      const paymentId = 'sample_payment_id';

      mockOrderPrisma.findByIdWithRelations.mockResolvedValue({
        id: orderId,
        payment_id: paymentId,
        items: [],
      });

      mockPaymentContract.getTransaction.mockResolvedValue({
        id: paymentId,
        order_id: orderId,
        status: 'APPROVED',
      });

      const result = await getStatusPaymentUseCase.execute(orderId);

      expect(result).toEqual({
        order_id: orderId,
        status: 'APPROVED',
      });
    });

    it('should handle error if order is not found', async () => {
      const orderId = 'nonexistent_order_id';

      mockOrderPrisma.findByIdWithRelations.mockResolvedValue(null);

      await expect(getStatusPaymentUseCase.execute(orderId)).rejects.toThrow(/* expected error response */);
    });

    it('should handle error if payment status is not found', async () => {
      const orderId = 'sample_order_id';

      mockOrderPrisma.findByIdWithRelations.mockResolvedValue({
        id: orderId,
        payment_id: 'nonexistent_payment_id',
        items: [],
      });

      mockPaymentContract.getTransaction.mockRejectedValue(new Error("payment status is not found"));

      await expect(getStatusPaymentUseCase.execute(orderId)).rejects.toThrow("payment status is not found");
    });
  });
});
