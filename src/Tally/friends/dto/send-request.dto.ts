import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';


export class SendRequestDto{
    @ApiProperty({example: "userId"})
    @IsString()
    @IsNotEmpty()
    userId!: string;

    @ApiProperty({example: "friendId"})
    @IsString()
    @IsNotEmpty()
    friendId!: string;
}