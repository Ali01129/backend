import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export const PAYMENT_METHODS = ['cash', 'paypal', 'bank', 'other'] as const;
export type PaymentMethodValue = (typeof PAYMENT_METHODS)[number];

export class CreateSettlementDto {
  @ApiProperty({ example: 'userId1', description: 'Who paid' })
  @IsString()
  @IsNotEmpty()
  fromUserId!: string;

  @ApiProperty({ example: 'userId2', description: 'Who received the payment' })
  @IsString()
  @IsNotEmpty()
  toUserId!: string;

  @ApiProperty({ example: 1500 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount!: number;

  @ApiProperty({ example: 'userId', description: 'Who created the settlement' })
  @IsString()
  @IsNotEmpty()
  createdBy!: string;

  @ApiProperty({ example: 'PKR' })
  @IsString()
  @Length(3, 3)
  currency!: string;

  @ApiProperty({ enum: PAYMENT_METHODS, example: 'cash' })
  @IsIn(PAYMENT_METHODS)
  paymentMethod!: PaymentMethodValue;
}
