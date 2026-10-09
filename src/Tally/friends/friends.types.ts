import { User } from "../users/user.types";

export interface Friend {
    id: string,
    userId: string,
    friendId: string,
    status: "pending" | "accepted" | "decline",
    createdAt: string,
    updatedAt: string | null,
    removedAt: string | null
}

export type friendReqInfo = Pick<Friend, "friendId" | "createdAt">;

export type friendInfo = Pick<User, "name">