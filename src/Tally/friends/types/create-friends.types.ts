import { User } from "../../users/types/create-user.types";

export interface Friend {
    id: string,
    userId: string,
    friendId: string,
    status: "pending" | "accepted" | "decline",
    createdAt: string,
    updatedAt: string | null,
    removedAt: string | null
}
