import { PaymentUpdateDTO } from "../payment.update.dto";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

describe('PaymentUpdateDTO', () => {
  it('should validate a valid PaymentUpdateDTO object', async () => {
    const validData = {
      action: 'payment.updated',
      api_version: 'v1',
      data: {
        id: '74158661809',
      },
      date_created: '2024-03-16T03:49:43Z',
      id: 111742934816,
      live_mode: true,
      type: 'payment',
      user_id: '133182600',
    };
    
    
    const paymentUpdateDTO = plainToClass(PaymentUpdateDTO, validData);
    const errors = await validate(paymentUpdateDTO);

    expect(errors).toHaveLength(0);
  });
});

