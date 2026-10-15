import { Firestore } from "firebase-admin/firestore";
import { FIRESTORE } from "../Firebase/firebase.module";
import { Injectable, Inject, ConflictException, NotFoundException, BadRequestException } from "@nestjs/common";
import {Expense, ExpenseItem, ExpenseShare} from "./expenses.types";
import { Group, GroupMember } from "../groups/groups.types";
import {ExactSplit} from "./expenses.types";
import {balance, settlement} from "../settlements/settlement.types";

@Injectable()
export class ExpenseService{
    constructor(@Inject(FIRESTORE) private readonly db: Firestore){}

    async createExpense(groupId: string, name: string,
            currency: string,
            paidBy: string,
            amount: number,
            splitMethod: "equal" | "exact" | "percent" | "by-items",
            createdBy: string, 
            percentage?: number,
            exactAmountSplits?: ExactSplit[],
            expenseItemName?: string,
            quantityOfItems?: number,
        ):Promise<Expense & Group>{
        const groupExpenseDoc = this.db.collection("expenses").doc();
        const groupRef = await this.db.collection("groups").doc(groupId).get();

        const groupMembersRef = await this.db.collection("groupMembers").where("groupId" , "==", groupId).get();

        // const balanceDoc = this.db.collection("balances").doc();
        
        const groupMembers = groupMembersRef.docs.map((member) => member.data().memberId as string);

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

        if(splitMethod === "percent"){
            for(const memberId of groupMembers){
                const splitAmount = await this.splitByPercentage( groupExpenseDoc.id, memberId, amount, percentage!);

                await this.createBalance(paidBy, memberId, splitAmount, groupId);
            }
        }

        if(splitMethod === "equal"){
            for(const memberId of groupMembers){
                const splitAmount = await this.splitEqually(groupId, groupExpenseDoc.id, memberId, amount);

                await this.createBalance(paidBy, memberId, splitAmount, groupId);
            }
        }
        if(splitMethod === "exact"){
            const exactSplits = exactAmountSplits ?? [];

            if (!exactSplits.length) {
                throw new BadRequestException("Exact splits are required");
            }

            await this.splitByExact(groupExpenseDoc.id, amount, exactSplits,paidBy,groupId);
        }

        if(splitMethod === "by-items"){
            await this.splitByItems(groupMembers, groupExpenseDoc.id, expenseItemName!, amount, quantityOfItems!,paidBy, groupId);
        }

        const groupData = groupRef.data() as Group;
        const group = { name: groupData.name, id: groupData.id, type: groupData.type };

        const expenseData = (await groupExpenseDoc.get()).data() as Expense;

        return { ...expenseData, ...group } as Expense & Group;
    }

    async membersOfGroup(groupId: string, expenseId: string):Promise<number>{
        const expenseRef = await this.db.collection("expenses").where("groupId", "==", groupId).where("id", "==", expenseId).get();

        const groupMembersRef = await this.db.collection("groupMembers").where("groupId", "==", groupId).get();
            
        const groupMembersCount = groupMembersRef.docs.length;

        console.log(groupMembersCount);

        return groupMembersCount;
    }


    async splitByExact( expenseId: string, totalAmount: number, splits: ExactSplit[],paidBy: string, groupId: string):Promise<void>{
        // const expShareDoc = this.db.collection("expenseShares").doc();

        // const totalMembers = this.membersOfGroup(groupId, expenseId);

        let splitAmount = 0;

        splits.forEach(perMember => {
            splitAmount = splitAmount + perMember.amount;
        });

        if(splitAmount !== totalAmount){
            throw new ConflictException("The split amount doesn't seem to add up to the total amount")
        }
        
        const batch = this.db.batch();

        for (const perMember of splits) {
            const expShareDoc = this.db.collection("expenseShares").doc(`${perMember.memberId}_${expenseId}`); // new ref per share

            batch.create(expShareDoc, {
                id: expShareDoc.id,
                expenseId: expenseId,
                userId: perMember.memberId,
                amount: totalAmount,
                percent: null,
                equal: null,
                exact: perMember.amount,
                byItems: null
            });

            await this.createBalance(paidBy, perMember.memberId, perMember.amount, groupId);
        }

        await batch.commit();

        // splits.forEach( async (perMember) => {
        //     expShareDoc.create({
        //         id: expShareDoc.id,
        //         expenseId: expenseId,
        //         userId: perMember.memberId,
        //         amount: totalAmount, 
        //         percent: null,
        //         equal: null,
        //         exact: perMember.amount
        // });

        // }
        // const expShare = (await expShareDoc.get()).data() as ExpenseShare;

        // return expShare;
    }

    async splitEqually(groupId: string, expenseId: string, memberId: string, totalAmount: number):Promise<number>{
        const expShareDoc = this.db.collection("expenseShares").doc(`${memberId}_${expenseId}`);
                
        // const expShareDoc = this.db.collection("expenseShares").doc();

        if(!totalAmount){
            throw new NotFoundException("Amount field must not be empty");
        }
        if(totalAmount <= 0){
            throw new ConflictException("Amount can't be zero or negative");
        }

        const totalMembers = await this.membersOfGroup(groupId, expenseId);

        const amount : number = Math.floor(totalAmount / totalMembers);

        await expShareDoc.create({
            id: expShareDoc.id,
            expenseId: expenseId,
            userId: memberId,
            amount: totalAmount, 
            percent: null,
            exact: null,
            equal: amount,
            byItems: null
        });

        return amount;
        //total amount should decrease !! it will in-settlement 

        // const expShare = (await expShareDoc.get()).data() as ExpenseShare;

        // return expShare;
    }

    async splitByPercentage( expenseId: string, memberId: string, totalAmount: number, percentage: number):Promise<number>{
        // const expShareDoc = this.db.collection("expenseShares").doc();

        const expShareDoc = this.db.collection("expenseShares").doc(`${memberId}_${expenseId}`);
                

        if(!percentage){
            throw new NotFoundException("Percentage field must not be empty");
        }
        if(percentage <= 0){
            throw new ConflictException("Percentage ratio can't be zero or negative");
        }

        // const totalMembers = await this.membersOfGroup(groupId, expenseId);

        const amount : number = Math.floor(totalAmount * (percentage/100));


        await expShareDoc.create({
            id: expShareDoc.id,
            expenseId: expenseId,
            userId: memberId,
            amount: totalAmount,
            exact: null,
            percent: amount,
            equal: null,
            byItems: null
        });

        return amount;
        //total amount should decrease !! Do somethingg about itt

        // const expShare = (await expShareDoc.get()).data() as ExpenseShare;

        // return expShare;
    }

    async splitByItems(memberIds: string[], expenseId: string,
    name: string,
    totalAmount: number,
    quantity: number,
    paidBy: string, groupId: string){
        const expenseItemDoc = this.db.collection("expenseItems").doc();

        if(!totalAmount){
            throw new NotFoundException("Amount field must not be empty");
        }
        if(quantity < 0){
            throw new ConflictException("Item quantity can't be zero or negative");
        }

        const batch = this.db.batch();

        batch.create(expenseItemDoc, {
            id: expenseItemDoc.id,
            expenseId,
            name,
            totalAmount,
            quantity
        });

        // expenseItemDoc.create({
        //     id: expenseItemDoc.id,
        //     expenseId,
        //     name,
        //     totalAmount,
        //     quantity
        // });

        const amount = Math.floor((totalAmount / memberIds.length) * 100) / 100;

        for(const memberId of memberIds){
            const memberDoc = this.db.collection("expenseItemMembers").doc(`${expenseItemDoc.id}_${memberId}`);

            batch.create(memberDoc, {
                expenseItemId: expenseItemDoc.id,
                memberId,
                amount
            });

            await this.createBalance(paidBy, memberId , amount, groupId);
        }

        await batch.commit();
        // const expenseItemMemberDocs = this.db.collection("expenseItemMembers").doc(expenseItemDoc.id);

        // expenseItemMemberDocs.create({
        //     expenseItemId: expenseItemDoc.id,
        //     userId: memberId,
        //     amount: amount
        // });

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

    async createBalance(paidByUserId: string, hasToPayLaterUserId: string, amount: number, groupId: string){

        const balanceDoc = this.db.collection("balances").doc(`${hasToPayLaterUserId}_${paidByUserId}`);

        const [toUser, fromUser] = await this.db.getAll(
        this.db.collection("groupMembers").doc(`${paidByUserId}_${groupId}`),
        this.db.collection("groupMembers").doc(`${hasToPayLaterUserId}_${groupId}`));

        if (!toUser.exists || !fromUser.exists) {
            throw new BadRequestException("Both users must be members of this group");
        }

        if((hasToPayLaterUserId !== paidByUserId)){
            balanceDoc.create({
                id: balanceDoc.id,
                groupId,
                fromUserId: hasToPayLaterUserId,
                toUserId: paidByUserId,
                amount
            });
        }
        
        // (await balanceDoc.get()).data() as 

    }
}

