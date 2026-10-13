import { Firestore } from "firebase-admin/firestore";
import { FIRESTORE } from "../Firebase/firebase.module";
import { Injectable, Inject, ConflictException, NotFoundException, BadRequestException } from "@nestjs/common";
import {Expense} from "./expenses.types";
import { Group } from "../groups/groups.types";
import { error } from "console";

@Injectable()
export class ExpenseService{
    constructor(@Inject(FIRESTORE) private readonly db: Firestore){}

    async createExpense(groupId: string, name: string,
            currency: string,
            paidBy: string,
            amount: number,
            splitMethod: "equal" | "exact" | "percent" | "by-items",
            createdBy: string):Promise<Expense & Group>{
        const groupExpenseDoc = this.db.collection("expenses").doc();
        const groupRef = await this.db.collection("groups").doc(groupId).get();
        
        await groupExpenseDoc.create({
            id: groupExpenseDoc.id,
            groupId,
            name,
            totalAmount: amount, 
            currency,
            paidByMemberId: paidBy,
            createdAt: new Date().toString(),
            splitMethod,
            note: null,
            reciptURL: null,
            createdBy,
            updatedAt: null
        });


        const groupData = groupRef.data() as Group;
        const group = { name: groupData.name, id: groupData.id, type: groupData.type };

        const expenseData = (await groupExpenseDoc.get()).data() as Expense;

        return { ...expenseData, ...group } as Expense & Group;
    }

    async getAll(groupId:string):Promise<Expense[]>{
        const groupExpenseRef =  await this.db.collection("groups").doc(groupId).get();

        if(!groupExpenseRef.exists){
            throw new NotFoundException("Group doesn't exist");
        }

        const expenses = await this.db.collection("expenses").where("groupId", "==", groupId).get();

        return expenses.docs.map((expense) => expense.data() as Expense);
    }

    async getOne(expenseId: string):Promise<Expense>{
        const groupExpenseDoc = this.db.collection("expenses").doc(expenseId);

        const ref = await groupExpenseDoc.get();

        if(!ref.exists){
            throw new NotFoundException("Expense not found!")
        }

        const expenseData = (await groupExpenseDoc.get()).data() as Expense;

        return expenseData;
    }

    async update(expenseId: string, groupId: string, name: string,
            currency: string,
            paidBy: string,
            amount: number,
            splitMethod: "equal" | "exact" | "percent" | "by-items",
            createdBy: string):Promise<Expense>{

        const groupExpenseDoc = this.db.collection("expenses").doc(expenseId);

        const ref = await groupExpenseDoc.get();
        
        if(!ref.exists){
            throw new NotFoundException("Expense not found!")
        }
        if((ref.data() as Expense).groupId !== groupId){
            throw new ConflictException("The expense doesn't belong to this group")
        }

        const updates: Record<string, unknown> = {};

        if (name !== undefined) updates.name = name;
        if (amount !== undefined) updates.totalAmount = amount;
        if (currency !== undefined) updates.currency = currency;
        if (createdBy !== undefined) updates.createdBy = createdBy;
        if (paidBy !== undefined) updates.paidByMemberId = paidBy;
        if (splitMethod !== undefined) updates.splitMethod = splitMethod;
        updates.updatedAt = new Date().toString();

        // if (Object.keys(updates).length === 0) {
        // throw new BadRequestException("No fields to update");
        // }

        await groupExpenseDoc.update(updates);

        // await groupExpenseDoc.update({
        //     name,
        //     totalAmount: amount, 
        //     currency,
        //     paidByMemberId: paidBy,
        //     createdAt: new Date().toString(),
        //     splitMethod,
        //     createdBy,
        //     updatedAt: new Date().toString()
        // });


        const updatedExpense = (await groupExpenseDoc.get()).data() as Expense;

        return updatedExpense;
    }

    async delete(expenseId: string, groupId: string){
        const groupExpenseDoc = this.db.collection("expenses").doc(expenseId);

        const ref = await groupExpenseDoc.get();
        
        if(!ref.exists){
            throw new NotFoundException("Expense not found!")
        }
        if((ref.data() as Expense).groupId !== groupId){
            throw new ConflictException("The expense doesn't belong to this group")
        }

        await groupExpenseDoc.delete();
    }

}

