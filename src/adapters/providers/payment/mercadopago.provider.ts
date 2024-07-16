import { PaymentContract } from '@/domain/contracts/payment.contract';
import { InternalServerErrorException } from '@nestjs/common';
import { Payment, MercadoPagoConfig } from 'mercadopago';

export class MercadoPagoProvider implements PaymentContract {
  protected client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  });
  protected _payment = new Payment(this.client);

  get payment(): Payment {
    return this._payment;
  }

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


  async processCard(body: Payment.ProcessCardRequest) {
    try {
      const payload = {
        transaction_amount: Number(body.transaction_amount),
        token: body.token,
        installments: body.installments,
        payment_method_id: body.payment_method_id,
        description: body.description,
        payer: {
          email: body.payer.email,
          identification: {
            type: body.payer.identification.type,
            number: body.payer.identification.number,
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
