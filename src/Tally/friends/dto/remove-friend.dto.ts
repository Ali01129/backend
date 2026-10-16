import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RemoveFriendQureyDto{
    @ApiProperty({example: "userId"})
    @IsString()
    @IsNotEmpty()
    userId!: string;

    // @ApiProperty({example: "friendId"})
    // @IsString()
    // @IsNotEmpty()
    // friendId!: string;
}

export class RemoveFriendParamDto{
    @ApiProperty({example: "friendId"})
    @IsString()
    @IsNotEmpty()
    friendId!: string;
}