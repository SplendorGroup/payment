import { InPreparationUseCase } from '../in-preparation.usecase';
import { IPrisma } from '../../../domain/contracts/prisma.contract';
import { ClientProxy } from '@nestjs/microservices';
import { MockProxy, mock } from 'jest-mock-extended';
import { Status } from '@prisma/client';

describe('InPreparationUseCase', () => {
  let inPreparationUseCase: InPreparationUseCase;
  let mockOrderPrisma: MockProxy<IPrisma<'order'>>;
  const mockClientProxy: Partial<ClientProxy> = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    emit: jest.fn().mockImplementation((pattern, data) => {
      return Promise.resolve({ message: 'Success' });
    }),
  };

  beforeEach(() => {
    mockOrderPrisma = mock<IPrisma<'order'>>();
    inPreparationUseCase = new InPreparationUseCase(
      mockOrderPrisma,
      mockClientProxy as ClientProxy,
    );
  });

  describe('execute', () => {
    it('should throw error if order is not found', async () => {
      const mockedIdempotent_key = '1';
      const mockedPaymentId = '1';
      mockOrderPrisma.findOne.mockResolvedValue(null);

      await expect(
        inPreparationUseCase.execute(mockedIdempotent_key, mockedPaymentId),
      ).rejects.toThrowError('Order not found');
    });

    it('should emit event to Producao service', async () => {
      const mockedIdempotent_key = '1';
      const mockedPaymentId = '1';
      const mockedOrder = {
        id: '1',
        status: 'CONFIRMED' as Status,
        idempotent_key: '1',
        payment_id: '123',
        value: 12,
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockOrderPrisma.findOne.mockResolvedValue(mockedOrder);
      inPreparationUseCase.execute(mockedIdempotent_key, mockedPaymentId);

      expect(mockClientProxy.emit).toHaveBeenCalledWith(
        'in_preparation',
        {
          idempotent_key: mockedOrder.idempotent_key,
          payment_id: mockedOrder.payment_id,
        },
      );
    });
  });
});
