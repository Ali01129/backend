
export interface Group{
    id: string;
    name: string;
    type: "trip" | "home" | "couple" | "event" | "other";
    timeline: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string | null;
    status: "active" | "inactive";
    deletedAt: string | null;
}

export interface GroupMember{
    groupId: string;
    userId: string;
    role: "admin" | "member";
    joinedAt: string;
}