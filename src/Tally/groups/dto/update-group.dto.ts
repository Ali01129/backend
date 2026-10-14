import { IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateGroupDto{
    // @ApiProperty({name: "groupId", example: "sdsald"})
    // @IsString()
    // groupId!: string;

    @ApiPropertyOptional({name: "groupName", example: "Dinner At Steak Away"})
    @IsString()
    groupName?: string;

    @ApiPropertyOptional({name: "groupType", example: "other"})
    @IsString()
    groupType?: string;
}