import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { IdentificationType } from '../../../domain/enum/identification-type.enum';
import { PaymentProcessDTO } from '../payment.process.dto';

describe('PaymentProcessDTO', () => {
  describe('Validation', () => {
    it('should validate a valid PaymentProcessDTO object', async () => {
      const validData = {
        payerFirstName: 'John',
        payerLastName: 'Doe',
        email: 'john.doe@example.com',
        idempotent_key: '1234567890',
        identificationType: IdentificationType.CPF,
        identificationNumber: '12345678909',
        items: [
          {
            product: 'Product 1',
            quantity: 2,
            price: 10.99,
          },
          {
            product: 'Product 2',
            quantity: 1,
            price: 20.5,
          },
        ],
      };

      const paymentProcessDTO = plainToClass(PaymentProcessDTO, validData);
      const errors = await validate(paymentProcessDTO);

      expect(errors).toHaveLength(0);
    });

    it('should validate a valid PaymentProcessDTO object without optional items', async () => {
      const validData = {
        payerFirstName: 'John',
        payerLastName: 'Doe',
        idempotent_key: '1234567890',
        email: 'john.doe@example.com',
        identificationType: IdentificationType.CPF,
        identificationNumber: '12345678909',
      };

      const paymentProcessDTO = plainToClass(PaymentProcessDTO, validData);
      const errors = await validate(paymentProcessDTO);

      expect(errors).toHaveLength(0);
    });

    it('should not validate an invalid PaymentProcessDTO object with missing required fields', async () => {
      const invalidData = {};

      const paymentProcessDTO = plainToClass(PaymentProcessDTO, invalidData);
      const errors = await validate(paymentProcessDTO);

      expect(errors).not.toHaveLength(0);
    });

    it('should not validate an invalid PaymentProcessDTO object with incorrect identificationType', async () => {
      const invalidData = {
        payerFirstName: 'John',
        payerLastName: 'Doe',
        email: 'john.doe@example.com',
        identificationType: 'INVALID_TYPE' as IdentificationType, // Incorrect type
        identificationNumber: '12345678909',
      };

      const paymentProcessDTO = plainToClass(PaymentProcessDTO, invalidData);
      const errors = await validate(paymentProcessDTO);

      expect(errors).not.toHaveLength(0);
    });

    it('should not validate an invalid PaymentProcessDTO object with invalid identificationNumber', async () => {
      const invalidData = {
        payerFirstName: 'John',
        payerLastName: 'Doe',
        email: 'john.doe@example.com',
        identificationType: IdentificationType.CPF,
        identificationNumber: 'invalid_number',
      };

      const paymentProcessDTO = plainToClass(PaymentProcessDTO, invalidData);

      const error = await validate(paymentProcessDTO);
      expect(error).not.toHaveLength(0);
    });
  });
});
