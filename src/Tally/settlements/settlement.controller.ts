import { Inject,Controller, Post , Body, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { SettlementService } from "./settlement.service";
import { ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import {CreateSettlementDto} from "./dto/create-settlemet.dto";


@Controller("/settlement")
export class SettlementController{
    constructor(@Inject(SettlementService) private readonly SettlementService: SettlementService ){}

    @Post("/:groupId/create/settlement")
    @ApiParam({name: "groupId", example: "fdkkfof"})
    @HttpCode(HttpStatus.OK)
        @ApiOperation({ summary: "Create expense" })
        @ApiResponse({
            status: 200,
            description: 'Expense created successfully',
        })
        @ApiResponse({
        status: 400,
        description: 'Bad request',
        })
        @ApiResponse({
        status: 500,
        description: 'Internal server error',
        })
        @ApiResponse({
        status: 400,
        description: 'Amount must be greater than zero',
        })
        @ApiResponse({
        status: 400,
        description: "You can't settle with yourself",
        })
        @ApiResponse({
        status: 400,
        description: "Both users must be members of this group",
        })
        @ApiResponse({
        status: 404,
        description: "Balance doc not found",
        })
        @ApiResponse({
        status: 409,
        description: "Amount has to be positive",
        })
        @ApiResponse({
        status: 409,
        description: "Amount is more than you owe them",
        })
        async create(@Param("groupId") groupId: string, @Body() CreateSettlementDto: CreateSettlementDto){
            return await this.SettlementService.create(groupId, CreateSettlementDto.fromUserId, CreateSettlementDto.toUserId, CreateSettlementDto.amount, 
                CreateSettlementDto.createdBy,
                CreateSettlementDto.currency, CreateSettlementDto.paymentMethod
            );
        }
}
