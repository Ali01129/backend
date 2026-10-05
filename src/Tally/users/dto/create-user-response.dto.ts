import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponseDto {
    @ApiProperty({example: "9844"}) id!: string;
    @ApiProperty({example : "Bill Gill"}) name!: string;
    @ApiProperty({example : "bill.gill@example.com"}) email!: string;
    @ApiProperty({example : "Bill"}) displayName!: string;
    @ApiProperty({example : "billgill"}) handle!: string;
    @ApiProperty({example : "#000000"}) avatarColor!: string;
    @ApiProperty({example : "USD"}) preferredCurrency!: string;
    @ApiProperty({example : true}) subscriptionStatus!: boolean; 
    @ApiProperty({example : true}) verified!: boolean;
}