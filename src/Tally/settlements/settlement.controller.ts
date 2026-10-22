import {
    Body,
    Controller,
    HttpStatus,
    Inject,
    Param,
    Post
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { apiResponseGenerator } from '../users/helpers/apiResponseGenerator';
import { CreateSettlementDto } from './dto/create-settlemet.dto';
import { SettlementService } from './settlement.service';

@Controller('/settlement')
export class SettlementController {
  constructor(
    @Inject(SettlementService)
    private readonly SettlementService: SettlementService,
  ) {}

  @Post('/:groupId/create/settlement')
  @ApiParam({ name: 'groupId', example: 'fdkkfof' })
  @apiResponseGenerator({
    operation: 'Create expense',
    httpCode: HttpStatus.OK,
    responses: [
      {
        status: 200,
        description: 'Expense created successfully',
      },
      {
        status: 400,
        description: 'Bad request',
      },
      {
        status: 500,
        description: 'Internal server error',
      },
      {
        status: 400,
        description: 'Amount must be greater than zero',
      },
      {
        status: 400,
        description: "You can't settle with yourself",
      },
      {
        status: 400,
        description: 'Both users must be members of this group',
      },
      {
        status: 404,
        description: 'Balance doc not found',
      },
      {
        status: 409,
        description: 'Amount has to be positive',
      },
      {
        status: 409,
        description: 'Amount is more than you owe them',
      },
    ],
  })
  async create(
    @Param('groupId') groupId: string,
    @Body() CreateSettlementDto: CreateSettlementDto,
  ) {
    return await this.SettlementService.create(
      groupId,
      CreateSettlementDto.fromUserId,
      CreateSettlementDto.toUserId,
      CreateSettlementDto.amount,
      CreateSettlementDto.createdBy,
      CreateSettlementDto.currency,
      CreateSettlementDto.paymentMethod,
    );
  }
}
