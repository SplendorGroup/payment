import { MockProxy, mock } from 'jest-mock-extended';
import { UpdatePaymentUseCase } from '../update-payment.usecase';
import { IPrisma } from '../../../domain/contracts/prisma.contract';
import { PaymentContract } from '../../../domain/contracts/payment.contract';
import { InPreparationUseCase } from '../in-preparation.usecase';
import { ClientProxy } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';
import { PaymentValuesObject } from '../../../domain/values-object/payment.values-object';
import { PaymentMapper } from '../../../domain/mappers/payment.mapper';

describe('UpdatePaymentUsecase', () => {
  let updatePaymentUseCase: UpdatePaymentUseCase;
  let inPreparationUseCase: InPreparationUseCase;
  let mockOrderPrisma: MockProxy<IPrisma<'order'>>;
  let mockPaymentContract: MockProxy<PaymentContract>;
  let mockedFailedPayment;
  let mockSuccessPayment;
  let paymentData;
  let mockOrder;

  beforeEach(() => {
    mockOrderPrisma = mock<IPrisma<'order'>>();
    mockPaymentContract = mock<PaymentContract>();
    const mockClientProxy: Partial<ClientProxy> = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      emit: jest.fn().mockImplementation((pattern, data) => {
        return Promise.resolve({ message: 'Success' });
      }),
    };
    inPreparationUseCase = new InPreparationUseCase(
      mockOrderPrisma,
      mockClientProxy as ClientProxy,
    );
    updatePaymentUseCase = new UpdatePaymentUseCase(
      mockOrderPrisma,
      mockPaymentContract,
      inPreparationUseCase,
    );

    mockedFailedPayment = {
      action: 'payment.failed',
      api_version: 'v1',
      data: {
        id: '74561629430',
      },
      date_created: '2024-03-19T01:04:53Z',
      id: 111793845207,
      live_mode: true,
      type: 'payment',
      user_id: '123',
    };

    mockSuccessPayment = {
      action: 'payment.updated',
      api_version: 'v1',
      data: {
        id: '74561629430',
      },
      date_created: '2024-03-19T01:04:53Z',
      id: 111793845207,
      live_mode: true,
      type: 'payment',
      user_id: '123',
    };

    paymentData = {
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
    };

    mockOrder = {
      id: '1',
      payment_id: '123',
      idempotent_key: '123',
      status: 'CONFIRMED',
      value: 50,
      created_at: new Date(),
      updated_at: new Date(),
    }
  });

  describe('execute', () => {
    it('should return Ok if payment action is different from payment.updated', async () => {
      const result = await updatePaymentUseCase.execute(mockedFailedPayment);
      expect(result).toBe(HttpStatus.OK);
    });
  });

  it('should return NotFoundException if payment is not found', async () => {
    mockOrderPrisma.findOne.mockResolvedValue(null);

    await expect(
      updatePaymentUseCase.execute(mockSuccessPayment),
    ).rejects.toThrow('Payment not found');
  });

  it('should return Ok if payment is updated', async () => {
    mockOrderPrisma.findOne.mockResolvedValue(mockOrder);
    jest.spyOn(PaymentMapper, 'GetStatusResponse').mockResolvedValue(paymentData as never);

    const result = await updatePaymentUseCase.execute(mockSuccessPayment);
    expect(result).toBe(HttpStatus.OK);
  });
});
