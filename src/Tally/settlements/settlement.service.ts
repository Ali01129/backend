import { Firestore } from "firebase-admin/firestore";
import { FIRESTORE } from "../Firebase/firebase.module";
import { Injectable, Inject, ConflictException, NotFoundException, BadRequestException } from "@nestjs/common";
import type { currencyCode } from "../users/user.types";
import type { paymentMethod } from "./settlement.types";
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
            this.db.collection("groupMembers").doc(`${groupId}_${fromUserId}`),
            this.db.collection("groupMembers").doc(`${groupId}_${toUserId}`),
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

        const ref = await groupSettleDoc.get();

        const data = ref.data() as settlement;

        return data;
    }
}