import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsObject, IsString } from "class-validator";

export class PaymentUpdateDTO {
  @ApiProperty()
  @IsString()
  action: string;

  @ApiProperty()
  @IsString()
  api_version: string;

  @ApiProperty()
  @IsObject()
  data: {
    id: string;
  };

  @ApiProperty()
  @IsString()
  date_created: string;

  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsBoolean()
  live_mode: boolean;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  user_id: string;
}

