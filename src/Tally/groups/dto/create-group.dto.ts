import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsIn } from "class-validator"


export class CreateGroupDto{
    @ApiProperty({name: "groupName", example: "shogran trip" })
    @IsString()
    @IsNotEmpty()
    groupName!: string;

    @ApiProperty({name: "groupType", enum: ["trip" , "home" , "couple" , "event" , "other"] })
    @IsIn(["trip" , "home" , "couple" , "event" , "other"])
    groupType!: string;
}
