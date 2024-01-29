import { ApiProperty } from '@nestjs/swagger';
import { IsCPFOrCNPJ } from 'brazilian-class-validator';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IdentificationType } from '../../domain/enum/identification-type.enum';

class Item {
  product: string;
  @IsNumber()
  quantity: number;
  @IsNumber()
  price: number;
}

export class PaymentProcessDTO {
  @ApiProperty()
  @IsString()
  payerFirstName: string;

  @ApiProperty()
  @IsString()
  payerLastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsEnum(IdentificationType)
  identificationType: IdentificationType;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => {
    const document = String(value)
      .split(/[^a-zA-Z0-9]/)
      .join('');
    return String(document);
  })
  @ApiProperty()
  @IsCPFOrCNPJ({ message: 'Documento é inválido.' })
  identificationNumber: string;

  @ApiProperty()
  @Type(() => Item)
  @IsArray()
  @IsOptional()
  items: Array<Item>;
}
