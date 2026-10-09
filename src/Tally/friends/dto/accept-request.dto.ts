import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';


export class AcceptRequestDto{
    @ApiProperty({example: "userId"})
    @IsString()
    @IsNotEmpty()
    sentBy!: string;

    @ApiProperty({example: "friendId"})
    @IsString()
    @IsNotEmpty()
    sentTo!: string;

    // @ApiProperty({example: "requestId"})
    // @IsString()
    // @IsNotEmpty()
    // friendRequestId!: string;
}