import { ApiProperty } from "@nestjs/swagger";
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from "class-validator";

export const SPLIT_METHODS = ["equal", "exact", "percent", "by-items"] as const;
export type SplitMethod = (typeof SPLIT_METHODS)[number];

export class CreateExpenseDto {
  @ApiProperty({ example: "Dinner at Café" })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: "PKR" })
  @IsString()
  @Length(3, 3)
  currency!: string;

  @ApiProperty({ example: "userId6" })
  @IsString()
  @IsNotEmpty()
  paidBy!: string;

  @ApiProperty({ example: 2500 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount!: number;

  @ApiProperty({ enum: SPLIT_METHODS, example: "equal" })
  @IsIn(SPLIT_METHODS)
  splitMethod!: SplitMethod;

  @ApiProperty({example: "user8"})
  @IsNotEmpty()
  @IsString()
  createdBy!: string;
}