export interface GroupMember{
    groupId: string;
    userId: string;
    role: "admin" | "member";
    joinedAt: string;
}
