import { Friend } from "./create-friends.types";


export type declineRequest = Pick<Friend, "friendId" | "status">
