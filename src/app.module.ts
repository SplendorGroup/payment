import { Module } from '@nestjs/common';
import { CoreModule } from '@/core/core.module';
import { PaymentController } from './adapters/controllers/payment.controller';
import { RepositoryModule } from './adapters/repositories/repository.module';
import { ProcessPaymentUseCase } from './application/usecases/process-payment.usecase';
import { ProvidersModule } from './adapters/providers/providers.module';
import { GetStatusPaymentUseCase } from './application/usecases/get-status-payment.usecase';
import { ViewPaymentUseCase } from './application/usecases/view-payment.usecase';
import { UpdatePaymentUseCase } from './application/usecases/update-payment.usecase';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { InPreparationUseCase } from '@/application/usecases/in-preparation.usecase';

@Module({
  imports: [CoreModule, ProvidersModule, RepositoryModule],
  controllers: [PaymentController],
  providers: [
    ProcessPaymentUseCase,
    GetStatusPaymentUseCase,
    ViewPaymentUseCase,
    UpdatePaymentUseCase,
    InPreparationUseCase,
    {
      provide: 'RMQ_CLIENT',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RMQ_URL],
            queue: 'in_preparation',
            queueOptions: {
              durable: true,
            },
          },
        });
      },
    },
  ],
})
export class AppModule {}
