
export interface User{
    id: string,
    name: string,
    email: string,
    displayName: string,
    handle: string,
    avatarColor: string,
    verified: boolean,
    preferredCurrency: currencyCode | string,
    subscriptionStatus: boolean, 
    createdAt: string,
    updatedAt: string | null
    deletedAt: string | null
}

export type currencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "INR" | "PKR";