import { OrderMapper } from '../mappers/order.mapper';
import { IPrisma } from '@/domain/contracts/prisma.contract';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class InPreparationUseCase {
  constructor(
    @Inject('Order')
    private readonly order: IPrisma<'order'>,
    @Inject('RMQ_CLIENT') private readonly client: ClientProxy,
  ) {}

  async execute(idempotent_key: string, payment_id: string) {
    const paymentData = await this.order.findOne({
      idempotent_key,
    });

    if (!paymentData) {
      throw new Error('Order not found');
    }

    const transformedData = OrderMapper.toInPreparation(paymentData, payment_id);

    try {
      await firstValueFrom(
        await this.client.emit('in_preparation', transformedData),
      );

      return { message: 'Success' };
    } catch (error) {
      throw new Error('Error occurred when trying to move order to in preparation');
    }
  }
}
