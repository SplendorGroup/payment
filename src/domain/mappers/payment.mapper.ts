import { PaymentValuesObject } from '../values-object/payment.values-object';

export class PaymentMapper {
  static ProcessResponse(
    data: Payment.ProcessResponse & {
      order_id: string;
      items: Array<{
        product: string;
        quantity: number;
        price: number;
        order_id: string;
      }>;
    },
  ) {
    const {
      id,
      order_id,
      items,
      date_created,
      date_approved,
      date_last_updated,
      date_of_expiration,
      payment_method,
      status,
      currency_id,
      description,
      transaction_amount,
      point_of_interaction,
    } = data;
    const producs = items.flatMap((item) => {
      delete item.order_id;
      return item;
    });
    return {
      id,
      order_id,
      date_created,
      date_approved,
      date_last_updated,
      date_of_expiration,
      payment_method: payment_method?.id,
      status: String(status).toUpperCase(),
      currency: currency_id,
      description,
      transaction_amount: PaymentValuesObject.Money(transaction_amount),
      items: producs,
      payment_url: point_of_interaction?.transaction_data?.ticket_url ?? null,
      qr_code: point_of_interaction?.transaction_data?.qr_code ?? null,
      qr_code_base64: point_of_interaction?.transaction_data?.qr_code_base64 ?? null,
    };
  }


  static GetStatusResponse(
    data: Payment.ProcessResponse & {
      order_id: string;
    },
  ) {
    const { order_id, status } = data as any;

    return {
      order_id,
      status,
    };
  }
}
