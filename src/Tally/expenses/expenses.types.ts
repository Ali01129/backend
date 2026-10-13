import type {currencyCode} from "../users/user.types";

export interface Expense{
    id: string;
    groupId: string;
    name: string;
    totalAmount: number;
    currency: currencyCode;
    paidByMemberId: string; //who paid the expense
    createdAt: string;
    splitMethod: splitMethod;
    note: string | null;
    reciptURL: string | null;
    createdBy: string; // who created the expense
    updatedAt: string | null;
}

export type splitMethod = "equal" | "exact" | "percent" | "by-items";


export interface ExpenseShare{
    expenseId: string;
    memberId: string;
    amount: number;
    precent: number;
    exact: number;
}

export interface ExpenseItem{
    id: string;
    expenseId: string;
    name: string;
    amount: number;
    quantity: number;
}

export interface ExpenseItemMember{
    expenseItemId: string;
    userId: string;
}

