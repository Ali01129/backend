import type {friendReqInfo} from "./get-friend-info.types";


export type friendRequest = friendReqInfo & {direction : "incoming" | "outgoing" | "all"};