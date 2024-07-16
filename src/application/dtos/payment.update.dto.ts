import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsNumber, IsObject, IsString } from "class-validator";

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
  @IsDateString()
  date_created: string;

  @ApiProperty()
  @IsString()
  id: number;

  @ApiProperty()
  @IsBoolean()
  live_mode: boolean;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsNumber()
  user_id: string;
}

