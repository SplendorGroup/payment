import { ApiProperty } from '@nestjs/swagger';
import { IsCPFOrCNPJ } from 'brazilian-class-validator';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';

class Item {
  order_id: string
  
  product: string;
  @IsNumber()
  quantity: number;
  @IsNumber()
  price: number;
}

class Identification {
  @ApiProperty()
  @IsNotEmpty()
  @Length(2)
  type: string

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
  number: string;
}

class Payer {
  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Identification)
  identification: Identification
}

export class PaymentProcessWithCreditCardTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(32)
  token: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1)
  issuer_id: string
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(3)
  payment_method_id: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  transaction_amount: number 

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  installments: number

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  idempotent_key: string

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Payer)
  payer: Payer

  @ApiProperty()
  @Type(() => Item)
  @IsArray()
  @IsOptional()
  items: Array<Item>;
}