import { Friend } from "./create-friends.types";
import {User} from "../../users/types/create-user.types"

export type friendReqInfo = Pick<Friend, "friendId" | "createdAt">;

export type friendInfo = Pick<User, "name">
