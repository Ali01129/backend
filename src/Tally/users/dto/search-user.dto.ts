import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class SearchUserDto{
    @ApiPropertyOptional({name: "id"})
    @IsString()
    // @IsNotEmpty()
    @IsOptional()
    id? : string;

    @ApiPropertyOptional({name: "name"})
    @IsString()
    // @IsNotEmpty()
    @IsOptional()
    name? : string;

    @ApiPropertyOptional({name: "email"})
    @IsString()
    // @IsNotEmpty()
    @IsOptional()
    email? : string;
}   

