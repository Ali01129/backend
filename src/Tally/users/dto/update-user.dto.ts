import {IsString, IsEmail, IsBoolean, IsOptional} from "class-validator";
import { ApiPropertyOptional } from '@nestjs/swagger';
import { currencyCode } from "../types/create-user.types";

export class UpdateUserDto {
    @ApiPropertyOptional({example : "Elham"})
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({example : "elham@example.com"})
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({example : "Elham Doe"})
    @IsString()
    @IsOptional()
    displayName?: string;

    @ApiPropertyOptional({example : "@elham"})
    @IsString()
    @IsOptional()
    handle?: string;

    @ApiPropertyOptional({example : "#000000"})
    @IsString()
    @IsOptional()
    avatarColor?: string;

    @ApiPropertyOptional({example : "USD"})
    @IsString()
    @IsOptional()
    preferredCurrency?: currencyCode;

    @ApiPropertyOptional({example : true})
    @IsBoolean()
    @IsOptional()
    subscriptionStatus?: boolean;

    @ApiPropertyOptional({example : true})
    @IsBoolean()
    @IsOptional()
    verified?: boolean;
}