import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentProcessDTO } from '../../application/dtos/payment.process.dto';
import { GetStatusPaymentUseCase } from '../../application/usecases/get-status-payment.usecase';
import { ProcessPaymentUseCase } from '../../application/usecases/process-payment.usecase';
import { ViewPaymentUseCase } from '../../application/usecases/view-payment.usecase';
import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { PaymentUpdateDTO } from '../../application/dtos/payment.update.dto';
import { UpdatePaymentUseCase } from '../../application/usecases/update-payment.usecase';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Payment')
@Controller('v1/payment')
export class PaymentController {
  constructor(
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly getStatusPaymentUseCase: GetStatusPaymentUseCase,
    private readonly viewPaymentUseCase: ViewPaymentUseCase,
    private readonly updatePaymentUseCase: UpdatePaymentUseCase,
  ) {}

  @MessagePattern('start_payment')
  @ApiOperation({ summary: 'Start payment' })
  async receiveOrder(@Payload() data: PaymentProcessDTO) {
    return await this.processPaymentUseCase.execute(data);
  }

  @Post('webhook/event')
  @ApiOperation({ summary: 'Receive webhook event' })
  @ApiBody({ type: PaymentUpdateDTO })
  async receiveWebhookEvent(@Req() _req, @Body() data: PaymentUpdateDTO) {
    return await this.updatePaymentUseCase.execute(data);
  }

  @Get('status/:idempotent_key')
  @ApiOperation({ summary: 'Get payment status' })
  async getStatus(
    @Req() _request,
    @Param('idempotent_key') idempotent_key: string,
  ) {
    return await this.getStatusPaymentUseCase.execute(idempotent_key);
  }

  @Get(':idempotent_key')
  @ApiOperation({ summary: 'Get payment by idempotent key' })
  async getPayment(
    @Req() _request,
    @Param('idempotent_key') idempotent_key: string,
  ) {
    return await this.viewPaymentUseCase.execute(idempotent_key);
  }
}
