
export enum currencyCode {
    USD = "USD",
    EUR = "EUR",
    GBP = "GBP",
    CAD = "CAD",
    AUD = "AUD",
    INR = "INR",
    PKR =  "PKR"
}

export interface User{
    id: string,
    name: string,
    email: string,
    displayName: string,
    handle: string,
    avatarColor: string,
    verified: boolean,
    preferredCurrency: currencyCode,
    subscriptionStatus: boolean, 
    createdAt: string,
    updatedAt: string | null
    deletedAt: string | null
}

// export type createUser = Extract<User, "id" | "createdAt" | "updatedAt" | "deletedAt">;

// export type currencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "INR" | "PKR";

