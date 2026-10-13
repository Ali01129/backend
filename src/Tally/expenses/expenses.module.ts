import { Module } from "@nestjs/common";
import { ExpenseService } from "./expenses.service";
import {ExpenseController} from "./expenses.controller";

@Module({
    providers: [ExpenseService],
    controllers: [ExpenseController]
})
export class ExpenseModule{};