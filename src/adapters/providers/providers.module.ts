import { Global, Module } from '@nestjs/common';
import { MercadoPagoProvider } from './payment/mercadopago.provider';

@Global()
@Module({
  providers: [
    {
      provide: 'Payment',
      useClass: MercadoPagoProvider,
    },
  ],
  exports: [
    {
      provide: 'Payment',
      useClass: MercadoPagoProvider,
    },
  ],
})
export class ProvidersModule {}
