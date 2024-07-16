import { Inject, Injectable } from '@nestjs/common';
import { IPrisma } from '@/domain/contracts/prisma.contract';
import { PaymentContract } from '@/domain/contracts/payment.contract';
import { PaymentMapper } from '../../domain/mappers/payment.mapper';
import { PaymentValuesObject } from '../../domain/values-object/payment.values-object';
import { PaymentProcessWithCreditCardTO } from '../dtos/payment-with-card.dto';

@Injectable()
export class ProcessPaymentWithCardUseCase {
  constructor(
    @Inject('Order')
    private readonly order: IPrisma<'order'>,
    @Inject('Item')
    private readonly item: IPrisma<'item'>,
    @Inject('Payment')
    private readonly payment: PaymentContract,
  ) {}

  async execute(data: PaymentProcessWithCreditCardTO) {
    const { items, ...rest } = data;

    console.log(data)

    const total = items.reduce((accumulator, { price, quantity }) => {
      return Number(price) * quantity + accumulator;
    }, 0);

    const order = await this.order.create({
      status: 'PENDING',
      value: total,
      idempotent_key: data.idempotent_key,
    });

    const products = items.flatMap((item: any) => {
      item.order_id = order.id;
      return item;
    });

    await this.item.createMany(products);

    const descriptions = products.flatMap(({ product, quantity, price }) => {
      const money = PaymentValuesObject.Money(price);
      return `${product} (x${quantity}) - ${money}`;
    });

    const description = descriptions.join('|');

    const payment = (await this.payment.processCard({
      ...rest,
      transaction_amount: total,
      description,
    })) as Payment.ProcessResponse;

    await this.order.update(order.id, { payment_id: String(payment.id) });
    return PaymentMapper.ProcessResponse({
      ...payment,
      order_id: order.id,
      items,
    });
  }
}
