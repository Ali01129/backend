import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  ValidateIf,
  Min, Max, IsInt, IsArray, ArrayNotEmpty,ValidateNested,
} from "class-validator";

import { Type } from "class-transformer";

export const SPLIT_METHODS = ["equal", "exact", "percent", "by-items"] as const;
export type SplitMethod = (typeof SPLIT_METHODS)[number];

export class ExactSplitDto {
    @ApiProperty({ example: "userId" })
    @IsString()
    @IsNotEmpty()
    memberId!: string;

    @ApiProperty({ example: 500 })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    amount!: number;
}


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

    @ApiPropertyOptional({example: "30", description: "Required when split method is percentage"})
    @ValidateIf((choosenMethod) => choosenMethod.splitMethod === "percent")
    @IsPositive()
    @IsNumber()
    @Min(0.01)
    @Max(100)
    percent?: number;

    // @ApiPropertyOptional({example: "4000", description: "Required when split method is equal"})
    // @ValidateIf((choosenMethod) => choosenMethod.splitMethod === "equal")
    // @IsPositive()
    // @IsNumber()
    // @Min(100)
    // equal!: number;

    @ApiPropertyOptional({ example: "Pizza", description: "Required when splitMethod is by-items" })
    @ValidateIf((choosenMethod) => choosenMethod.splitMethod === "by-items")
    @IsString()
    @IsNotEmpty()
    expenseItemName?: string;

    @ApiPropertyOptional({ example: 2, description: "Required when splitMethod is by-items" })
    @ValidateIf((choosenMethod) => choosenMethod.splitMethod === "by-items")
    @IsInt()
    @Min(1)
    @IsPositive()
    quantityOfItems?: number;

    @ApiPropertyOptional({example: `[{"user1": "100"},{"user2": "400"}]` , description: "Required when splitMethod is exact", type: [ExactSplitDto] })
    @ValidateIf((choosenMethod) => choosenMethod.splitMethod === "exact")
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ExactSplitDto)
    exactAmountSplits?: ExactSplitDto[];

}


