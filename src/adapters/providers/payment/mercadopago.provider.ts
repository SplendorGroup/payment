import { PaymentContract } from '@/domain/contracts/payment.contract';
import { InternalServerErrorException } from '@nestjs/common';
import { Payment, MercadoPagoConfig } from 'mercadopago';

export class MercadoPagoProvider implements PaymentContract {
  protected client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  });
  protected payment = new Payment(this.client);

  async process(body: Payment.ProcessRequest) {
    try {
      const payload = {
        transaction_amount: Number(body.transactionAmount),
        token: body.token,
        description: body.description,
        installments: 1,
        payment_method_id: 'pix',
        payer: {
          email: body.email,
          first_name: body.payerFirstName,
          last_name: body.payerLastName,
          identification: {
            type: body.identificationType,
            number: body.identificationNumber,
          },
        },
      };

      return await this.payment.create({
        body: payload,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getTransaction(id) {
    try {
      return await this.payment.get({ id });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
