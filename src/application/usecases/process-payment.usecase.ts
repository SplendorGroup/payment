import { Inject, Injectable } from '@nestjs/common';
import { PaymentProcessDTO } from '../dtos/payment.process.dto';
import { IPrisma } from '@/domain/contracts/prisma.contract';
import { PaymentContract } from '@/domain/contracts/payment.contract';
import { PaymentMapper } from '../../domain/mappers/payment.mapper';
import { PaymentValuesObject } from '../../domain/values-object/payment.values-object';

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    @Inject('Order')
    private readonly order: IPrisma<'order'>,
    @Inject('Item')
    private readonly item: IPrisma<'item'>,
    @Inject('Payment')
    private readonly payment: PaymentContract,
  ) {}

  async execute(data: PaymentProcessDTO) {
    const { items, ...rest }: any = data;

    const total = items.reduce((accumulator, { price, quantity }) => {
      return Number(price) * quantity + accumulator;
    }, 0);

    const order = await this.order.create({
      status: 'PENDING',
      value: total,
      idempotent_key: data.idempotent_key,
    });

    const products = items.flatMap((item) => {
      item.order_id = order.id;
      return item;
    });

    await this.item.createMany(products);

    const descriptions = products.flatMap(({ product, quantity, price }) => {
      const money = PaymentValuesObject.Money(price);
      return `${product} (x${quantity}) - ${money}`;
    });

    const description = descriptions.join('|');

    const payment = (await this.payment.process({
      ...rest,
      transactionAmount: total,
      description,
      token: order.id,
    })) as Payment.ProcessResponse;

    await this.order.update(order.id, { payment_id: String(payment.id) });
    return PaymentMapper.ProcessResponse({
      ...payment,
      order_id: order.id,
      items,
    });
  }
}
