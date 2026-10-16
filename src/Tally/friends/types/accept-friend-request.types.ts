import {Friend} from "../types/create-friends.types"

export type acceptFriendRequest = Pick<Friend, "id" | "createdAt" | "updatedAt" | "status">