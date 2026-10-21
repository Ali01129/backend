import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { splitMethods } from '../types/splitMethod.types';

export class CreateExpenseDto {
  @ApiProperty({ example: 'Dinner at Café' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'PKR' })
  @IsString()
  @Length(3, 3)
  currency!: string;

  @ApiProperty({ example: 'userId6' })
  @IsString()
  @IsNotEmpty()
  paidBy!: string;

  @ApiProperty({ example: 2500 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount!: number;

  @ApiProperty({ example: 'equal' })
  @IsIn(Object.values(splitMethods))
  splitMethod!: splitMethods;

  @ApiProperty({ example: 'user8' })
  @IsNotEmpty()
  @IsString()
  createdBy!: string;
}
