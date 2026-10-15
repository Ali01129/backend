import { Firestore } from "firebase-admin/firestore";
import { FIRESTORE } from "../Firebase/firebase.module";
import { Injectable, Inject, ConflictException, NotFoundException, BadRequestException } from "@nestjs/common";
import type { currencyCode } from "../users/user.types";
import type { balance, paymentMethod } from "./settlement.types";
import { settlement } from "./settlement.types";

@Injectable()
export class SettlementService{
    constructor(@Inject(FIRESTORE) private readonly db: Firestore){}

    async create(groupId: string,
        fromUserId: string,
        toUserId: string,
        amount: number,
        createdBy: string,
        currency: string,
        paymentMethod: paymentMethod,
    ):Promise<settlement>{
        if (amount <= 0) {
            throw new BadRequestException("Amount must be greater than zero");
        }
        if (fromUserId === toUserId) {
            throw new BadRequestException("You can't settle with yourself");
        }

        const groupSnap = await this.db.collection("groups").doc(groupId).get();
        if (!groupSnap.exists) {
            throw new NotFoundException("Group not found");
        }

        const [toUser, fromUser] = await this.db.getAll(
            this.db.collection("groupMembers").doc(`${fromUserId}_${groupId}`),
            this.db.collection("groupMembers").doc(`${toUserId}_${groupId}`),
        );

        if (!toUser.exists || !fromUser.exists) {
            throw new BadRequestException("Both users must be members of this group");
        }

        const groupSettleDoc = this.db.collection("settlements").doc();
        
        await groupSettleDoc.create({
                id: groupSettleDoc.id,
                groupId: groupId,
                fromUserId: fromUserId,
                toUserId: toUserId,
                amount: amount,
                createdBy: createdBy,
                currency: currency,
                paymentMethod: paymentMethod,
                note: null,
                createdAt: new Date().toString()
        });

        await this.updateBalance( toUserId, fromUserId, amount);

        const ref = await groupSettleDoc.get();

        const data = ref.data() as settlement;

        return data;
    }

    async updateBalance(paidByUserId: string, isPayingBack: string, payingBack: number):Promise<number>{

        const balanceRef = this.db.collection("balances").doc(`${isPayingBack}_${paidByUserId}`);

        const balanceDoc = await balanceRef.get();

        if(!(balanceDoc.exists)){
            throw new NotFoundException("Balance doc not found");
        }

        const currentBalanceData = balanceDoc.data() as balance;

        const am = currentBalanceData.amount;
        // const currentBalance = currentBalanceData.amount;

        if(payingBack <= 0){
            throw new ConflictException("Amount has to be positive");
        }

        if(payingBack > am){
            throw new ConflictException("Amount is more than you owe them");
        }

        const amount = (am - payingBack) as number;

        await balanceRef.update({
                fromUserId: isPayingBack,
                toUserId: paidByUserId,
                amount: amount
        });

        const updatedBalanceData = (await balanceRef.get()).data() as balance;

        return updatedBalanceData.amount;

    }
}