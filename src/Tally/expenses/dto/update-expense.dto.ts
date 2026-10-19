import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsNotEmpty,IsNumber,IsOptional,IsPositive,IsString,Length,
} from "class-validator";
import { splitMethods } from "../types/splitMethod.types";


export class UpdateExpenseDto {
  @ApiPropertyOptional({ example: "Dinner at Café" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ example: "PKR" })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;

  @ApiPropertyOptional({ example: "userId1" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  paidBy?: string;

  @ApiPropertyOptional({ example: 2500 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount?: number;

  @ApiPropertyOptional({ example: "equal" })
  @IsOptional()
  @IsIn(Object.values(splitMethods))
  splitMethod?: splitMethods;

  @ApiPropertyOptional({ example: "user5" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  createdBy?: string;
}