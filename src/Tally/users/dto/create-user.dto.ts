import {IsString, IsNotEmpty, IsEmail, IsBoolean, validate} from "class-validator";
import { ApiProperty } from '@nestjs/swagger';


export class CreateUserDto {
    @ApiProperty({example : "Bill Gill"})
    @IsString()
    @IsNotEmpty()
    readonly name!: string;

    @ApiProperty({example : "bill.gill@example.com"})
    // @validate(IsUnique("email" , {message: "Email already exists"}))
    @IsEmail()
    @IsNotEmpty()
    readonly email!: string;

    @ApiProperty({example : "Bill"})
    @IsString()
    @IsNotEmpty()
    readonly displayName!: string;
    
    @ApiProperty({example : "billgill"})
    @IsString()
    @IsNotEmpty()
    readonly handle!: string;

    @ApiProperty({example : "#000000"})
    @IsString()
    @IsNotEmpty()
    readonly avatarColor!: string;

    @ApiProperty({example : "USD"})
    @IsString()
    @IsNotEmpty()
    readonly preferredCurrency!: string;

    @ApiProperty({example : true})
    @IsBoolean()
    @IsNotEmpty()
    readonly subscriptionStatus!: boolean; 

    @ApiProperty({example : true})
    @IsBoolean()
    @IsNotEmpty()
    readonly verified!: boolean;
    
}