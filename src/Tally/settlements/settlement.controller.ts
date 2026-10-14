import { Inject,Controller, Post , Body, HttpCode, HttpStatus, Get, Param, Delete, Patch, Query } from "@nestjs/common";
import { SettlementService } from "./settlement.service";
import { ApiOperation, ApiResponse, ApiParam, ApiQuery } from "@nestjs/swagger";
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
        async create(@Param("groupId") groupId: string, @Body() CreateSettlementDto: CreateSettlementDto){
            return await this.SettlementService.create(groupId, CreateSettlementDto.fromUserId, CreateSettlementDto.toUserId, CreateSettlementDto.amount, 
                CreateSettlementDto.createdBy,
                CreateSettlementDto.currency, CreateSettlementDto.paymentMethod
            );
        }

}
