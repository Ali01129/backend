import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    Patch,
    Post
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { apiResponseGenerator } from '../users/helpers/apiResponseGenerator';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseService } from './expenses.service';
import { Expense } from './types/create-expense.types';

@Controller('/expense')
export class ExpenseController {
  constructor(
    @Inject(ExpenseService) private readonly ExpenseService: ExpenseService,
  ) {}

  @Post('/:groupId/create')
  @ApiParam({ name: 'groupId', example: 'fdkkfof' })
  @apiResponseGenerator({
    operation: 'Create expense',
    httpCode: HttpStatus.OK,
    responses: [],
  })
  async create(
    @Param('groupId') groupId: string,
    @Body() expense: CreateExpenseDto,
  ): Promise<Expense> {
    const createdExpense = this.ExpenseService.createExpense(
      groupId,
      expense.name,
      expense.currency,
      expense.paidBy,
      expense.amount,
      expense.splitMethod,
      expense.createdBy,
    );
    return createdExpense;
  }

  @Patch('/:groupId/:expenseId/update')
  @ApiParam({ name: 'groupId', example: 'fdkkfof' })
  @ApiParam({ name: 'expenseId', example: 'vnjbgf' })
  @apiResponseGenerator({
    operation: 'Updated expense',
    httpCode: HttpStatus.OK,
    responses: [
      {
        status: 409,
        description: "The expense doesn't belong to this group",
      },
      {
        status: 404,
        description: 'No fields to update',
      },
    ],
  })
  async update(
    @Param('groupId') groupId: string,
    @Param('expenseId') expenseId: string,
    @Body() expense: UpdateExpenseDto,
  ): Promise<Expense> {
    const updatedExpense = this.ExpenseService.update(
      expenseId,
      groupId,
      expense.name!,
      expense.currency!,
      expense.paidBy!,
      expense.amount!,
      expense.splitMethod!,
      expense.createdBy!,
    );
    return updatedExpense;
  }

  @Delete('/:groupId/:expenseId')
  @ApiParam({ name: 'groupId', example: 'VCAohl' })
  @ApiParam({ name: 'expenseId', example: 'vevcerf' })
  @apiResponseGenerator({
    operation: 'Delete an expense',
    httpCode: HttpStatus.OK,
    responses: [
      {
        status: 409,
        description: "The expense doesn't belong to this group",
      },
    ],
  })
  async delete(
    @Param('groupId') groupId: string,
    @Param('expenseId') expenseId: string,
  ) {
    await this.ExpenseService.delete(expenseId, groupId);
  }

  @Get('/:expenseId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'expenseId', example: 'dkwfnw' })
  @apiResponseGenerator({
    operation: 'search an expense',
    httpCode: HttpStatus.OK,
    responses: [],
  })
  async getOne(@Param('expenseId') expenseId: string): Promise<Expense> {
    const expense = await this.ExpenseService.getOne(expenseId);

    return expense;
  }

  @Get('/:groupId/expenses')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'groupId', example: 'Qwdkwfnw' })
  @apiResponseGenerator({
    operation: 'Get all expenses of a given group',
    httpCode: HttpStatus.OK,
    responses: [
      {
        status: 404,
        description: "Group doesn't exist",
      },
    ],
  })
  async getAll(@Param('groupId') groupId: string): Promise<Expense[]> {
    const expense = await this.ExpenseService.getAll(groupId);

    return expense;
  }
}

