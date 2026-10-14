import { Inject,Controller, Post , Body, HttpCode, HttpStatus, Get, Param, Delete, Patch, Query } from "@nestjs/common";
import { ExpenseService } from "./expenses.service";
import { ApiOperation, ApiResponse, ApiParam, ApiQuery } from "@nestjs/swagger";
import {CreateExpenseDto} from "./dto/create-expense.dto";
import { Expense } from "./expenses.types";
import { UpdateExpenseDto} from "./dto/update-expense.dto";

@Controller("/expense")
export class ExpenseController{
    constructor(@Inject(ExpenseService) private readonly ExpenseService: ExpenseService ){}

    @Post("/:groupId/create")
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
        description: 'Exact splits are required',
        })
        @ApiResponse({
        status: 409,
        description: "The split amount doesn't seem to add up to the total amount",
        })
        @ApiResponse({
        status: 404,
        description: "Amount field must not be empty",
        })
        @ApiResponse({
        status: 409,
        description: "Amount can't be zero or negative",
        })
        @ApiResponse({
        status: 404,
        description: "Percentage field must not be empty",
        })
        @ApiResponse({
        status: 409,
        description: "Percentage ratio can't be zero or negative",
        })
        @ApiResponse({
        status: 409,
        description: "Item quantity can't be zero or negative",
        })
        async create(@Param("groupId") groupId: string ,@Body() expense: CreateExpenseDto):Promise<Expense>{
            const createdExpense = this.ExpenseService.createExpense(groupId ,expense.name, expense.currency , expense.paidBy, expense.amount, expense.splitMethod, expense.createdBy ,expense.percent, expense.exactAmountSplits, expense.expenseItemName, expense.quantityOfItems);
            return createdExpense;
        }
    
    
    @Patch("/:groupId/:expenseId/update")
    @ApiParam({name: "groupId", example: "fdkkfof"})
    @ApiParam({name: "expenseId", example: "vnjbgf"})
    @HttpCode(HttpStatus.OK)
        @ApiOperation({ summary: "Updated expense" })
        @ApiResponse({
            status: 200,
            description: 'Updated expense successfully',
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
        status: 404,
        description: 'Expense not found!',
        })
        @ApiResponse({
        status: 409,
        description: "The expense doesn't belong to this group",
        })
        
        async update(@Param("groupId") groupId: string ,@Param("expenseId") expenseId: string ,@Body() expense: UpdateExpenseDto):Promise<Expense>{
            const updatedExpense = this.ExpenseService.update(expenseId, groupId, expense.name!, expense.currency!, expense.paidBy!, expense.amount!, expense.splitMethod!, expense.createdBy!);
            return updatedExpense;
        }
    
    @Delete("/:groupId/:expenseId")
        @ApiOperation({ summary: "Delete an expense" })
        @ApiParam({ name: "groupId", example: "VCAohl" })
        @ApiParam({ name: "expenseId", example: "vevcerf" })
        @ApiResponse({
            status: 200,
            description: 'Successfully deleted expense',
        })
        @ApiResponse({ 
            status: 404,
            description: "Expense not found!" })
        @ApiResponse({
            status: 409,
            description: "The expense doesn't belong to this group" })
        @ApiResponse({
        status: 400,
        description: 'Bad request',
        })
        @ApiResponse({
        status: 500,
        description: 'Internal server error',
        })    
        async delete(@Param("groupId") groupId: string, @Param("expenseId") expenseId: string ){
            await this.ExpenseService.delete(expenseId,groupId);
        }

    @Get("/:expenseId")
    @HttpCode(HttpStatus.OK)
    @ApiParam({name: "expenseId", example: "dkwfnw"})
        @ApiOperation({ summary: "search an expense" })
        @ApiResponse({
            status: 200,
            description: 'Successfully fetched the expense',
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
        status: 404,
        description: "Expense not found!",
        })
        async getOne(@Param("expenseId") expenseId: string):Promise<Expense>{
            const expense = await this.ExpenseService.getOne(expenseId);

            return expense;
        }
    
    @Get("/:groupId/expenses")
    @HttpCode(HttpStatus.OK)
    @ApiParam({name: "groupId", example: "Qwdkwfnw"})
        @ApiOperation({ summary: "Get all expenses of a given group" })
        @ApiResponse({
            status: 200,
            description: 'Successfully fetched all the expense',
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
        status: 404,
        description: "Group doesn't exist",
        })
        async getAll(@Param("groupId") groupId: string):Promise<Expense[]>{
            const expense = await this.ExpenseService.getAll(groupId);

            return expense;
        }

        

}
