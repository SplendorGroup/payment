import { Status } from "@prisma/client";
import { OrderMapper } from "../order.mapper";

describe('OrderMapper', () => {
  it('should transform object using the toInPreparation function', () => {
    const mockedOrder = {
        id: '1',
        status: 'CONFIRMED' as Status,
        idempotent_key: '1',
        payment_id: '123',
        value: 1000,
        created_at: new Date(),
        updated_at: new Date(),
    };

    const result = OrderMapper.toInPreparation(mockedOrder, '123');

    expect(result).toEqual({
      idempotent_key: '1',
      payment_id: '123',
    });
  });
});
