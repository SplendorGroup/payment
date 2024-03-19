import { PaymentUpdateDTO } from '@/application/dtos/payment.update.dto';
import { InPreparationUseCase } from './in-preparation.usecase';
import { PaymentContract } from '@/domain/contracts/payment.contract';
import { IPrisma } from '@/domain/contracts/prisma.contract';
import { PaymentMapper } from '../../domain/mappers/payment.mapper';
import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class UpdatePaymentUseCase {
  constructor(
    @Inject('Order')
    private readonly order: IPrisma<'order'>,
    @Inject('Payment')
    private readonly payment: PaymentContract,
    private readonly inPreparationUseCase: InPreparationUseCase,
  ) {}

  async execute(data: PaymentUpdateDTO) {
    if (data.action !== 'payment.updated') {
      return HttpStatus.OK;
    }

    const paymentData = await this.order.findOne({
      payment_id: data.data.id,
    });

    if (!paymentData) {
      throw new NotFoundException('Payment not found');
    }

    const remotePaymentData = (await this.payment.getTransaction(
      paymentData.payment_id,
    )) as Payment.ProcessResponse;

    const paymentStatus = PaymentMapper.GetStatusResponse({
      ...remotePaymentData,
      order_id: paymentData.idempotent_key,
    });

    if (paymentStatus.status === 'refunded') {
      await this.order.update(paymentData.id, {
        status: 'CANCELLED',
      });

      return HttpStatus.OK;
    }

    if (paymentStatus.status === 'approved') {
      await this.order.update(paymentData.id, {
        status: 'CONFIRMED',
      });

      this.inPreparationUseCase.execute(
        paymentData.idempotent_key,
        paymentData.payment_id,
      );

      return HttpStatus.CREATED;
    }

    return HttpStatus.OK;
  }
}
