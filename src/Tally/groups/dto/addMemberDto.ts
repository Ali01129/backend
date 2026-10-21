import { ApiProperty } from "@nestjs/swagger";
import { ArrayMaxSize, ArrayMinSize, ArrayNotEmpty, ArrayUnique, IsArray, IsString } from "class-validator";


export class addMemberDto{
    @ApiProperty({name: "memberIds", example: [ "member1_Id" , "member2_Id" ]} )
    @IsArray()
    @ArrayNotEmpty()
    @IsString({each: true})
    @ArrayUnique()
    @ArrayMinSize(1)
    memberIds!: string[];
}
