import { PaymentProcessDTO } from '@/application/dtos/payment.process.dto';
import { GetStatusPaymentUseCase } from '@/application/usecases/get-status-payment.usecase';
import { ProcessPaymentUseCase } from '@/application/usecases/process-payment.usecase';
import { ViewPaymentUseCase } from '@/application/usecases/view-payment.usecase';
import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly getStatusPaymentUseCase: GetStatusPaymentUseCase,
    private readonly viewPaymentUseCase: ViewPaymentUseCase,
    ) {}

  @Post('process')
  async process(@Req() _request, @Body() body: PaymentProcessDTO) {
    return await this.processPaymentUseCase.execute(body);
  }

  @Get('status/:id')
  async getStatus(@Req() _request, @Param('id') id: string) {
    return await this.getStatusPaymentUseCase.execute(id);
  }

  @Get(':id')
  async getPayment(@Req() _request, @Param('id') id: string) {
    return await this.viewPaymentUseCase.execute(id);
  }
}
