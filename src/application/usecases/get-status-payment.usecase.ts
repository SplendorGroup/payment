import { Inject, Injectable } from '@nestjs/common';
import { IPrisma } from '@/domain/contracts/prisma.contract';
import { PaymentContract } from '@/domain/contracts/payment.contract';
import { PaymentMapper } from '@/domain/mappers/payment.mapper';

@Injectable()
export class GetStatusPaymentUseCase {
  constructor(
    @Inject('Order')
    private readonly order: IPrisma<'order'>,
    @Inject('Payment')
    private readonly payment: PaymentContract,
  ) {}

  async execute(id: string) {
    const { payment_id } = await this.order.findByIdWithRelations(id, ['items'])

    const payment = await this.payment.getTransaction(payment_id) as Payment.ProcessResponse;

    return PaymentMapper.GetStatusResponse({ ...payment, order_id: id })
  }

}
