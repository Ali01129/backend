import { ApiProperty } from "@nestjs/swagger"

export class SendRequestResponseDto{
    @ApiProperty({example: "dmw_ckdmw"}) id!: string;
    @ApiProperty({example: "dmw"}) userId!: string;
    @ApiProperty({example: "ckdmw"}) friendId!: string;
    @ApiProperty({example: "pending"}) status!: string;
    @ApiProperty({example: "3 oct 2026"}) createdAt!: string;
    @ApiProperty({example: "null"}) updatedAt!: string;
    @ApiProperty({example: "null"}) removedAt!: string;
}