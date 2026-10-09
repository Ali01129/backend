import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class SearchFriendDto {
    @ApiPropertyOptional({example: "userId"})
    @IsOptional()
    @IsString()
    id?: string;

    @ApiPropertyOptional({example: "example43@gmail.com"})
    @IsOptional()
    @IsString()
    email?: string;

    @ApiPropertyOptional({example: "@handler"})
    @IsOptional()
    @IsString()
    handle?: string;
}