import type { currencyCode } from "../../users/types/create-user.types";

import type {paymentMethod} from "./paymentMethod.types";

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
