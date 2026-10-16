import { User } from "./create-user.types"


export type updateUser = Partial<Pick<User, "name" | "email" | "displayName" | "handle" | "avatarColor" | "preferredCurrency" | "subscriptionStatus" | "verified" | "deletedAt"  >>