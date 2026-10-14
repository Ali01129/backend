import type { currencyCode } from "../users/user.types";

export type paymentMethod = "cash" | "paypal" | "bank" | "other";


export interface settlement{
    id: string;
    groupId: string;
    fromUserId: string;
    toUserId: string;
    amount: number;
    createdBy: string;
    currency: currencyCode;
    paymentMethod: paymentMethod;
    note: string | null;
    createdAt: string;
}

export interface balance{
    id: string;
    groupId: string;
    fromUserId: string;
    toUserId: string;
    amount: number; 
    // currency: currencyCode;
}



// export type balancedirection = "owes_you" | "you_owe" | "settled";

