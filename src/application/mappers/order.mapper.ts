import { InPreparationDTO } from '@/application/dtos/in-preparation.dto';
import { Order } from '@prisma/client';

export class OrderMapper {
  static toInPreparation(data: Order, payment_id: string): InPreparationDTO {
    return {
      idempotent_key: data.idempotent_key,
      payment_id,
    };
  }
}
