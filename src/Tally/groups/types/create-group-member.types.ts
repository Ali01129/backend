export interface GroupMember{
    groupId: string;
    memberId: string;
    role: "admin" | "member";
    joinedAt: string;
}
