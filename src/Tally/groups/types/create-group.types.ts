export type groupType = "trip" | "home" | "couple" | "event" | "other";


export interface Group{
    id: string;
    name: string;
    type: groupType;
    timeline: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string | null;
    status: "active" | "inactive";
    deletedAt: string | null;
}
