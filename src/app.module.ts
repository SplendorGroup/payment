import { Module } from '@nestjs/common';
import { CoreModule } from '@/core/core.module';
import { PaymentController } from './adapters/controllers/payment.controller';
import { RepositoryModule } from './adapters/repositories/repository.module';
import { ProcessPaymentUseCase } from './application/usecases/process-payment.usecase';
import { ProvidersModule } from './adapters/providers/providers.module';
import { GetStatusPaymentUseCase } from './application/usecases/get-status-payment.usecase';
import { ViewPaymentUseCase } from './application/usecases/view-payment.usecase';

@Module({
  imports: [CoreModule, ProvidersModule, RepositoryModule],
  controllers: [PaymentController],
  providers: [
    ProcessPaymentUseCase,
    GetStatusPaymentUseCase,
    ViewPaymentUseCase,
  ],
})
export class AppModule {}
