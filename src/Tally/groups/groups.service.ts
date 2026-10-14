import { Firestore } from "firebase-admin/firestore";
import { FIRESTORE } from "../Firebase/firebase.module";
import { Injectable, Inject, ConflictException, NotFoundException, BadRequestException } from "@nestjs/common";
import {Group} from "./groups.types";
import { GroupMember } from "./groups.types";


export class GroupsService{
    constructor(@Inject(FIRESTORE) private readonly db: Firestore){}

    groupMemberBuilder(groupId: string, memberId: string, role: "member" | "admin"){
        return {
            groupId,
            memberId,
            role,
            joinedAt: new Date().toString()
        }
    }

    async create(adminId: string, groupName: string, groupType: "trip" | "home" | "couple" | "event" | "other"):Promise<Group>{
        const createdAt = new Date().toString();

        const groupTimeline: string = createdAt + "- Present";

        const groupIdDoc = this.db.collection("groups").doc();

        const batch = await this.db.batch();

        const groupAdminDoc = this.db.collection("groupMembers").doc(`${adminId}_${groupIdDoc.id}`);

        const groupAdmin = this.groupMemberBuilder(groupIdDoc.id, adminId, "admin");

        batch.create(groupAdminDoc, groupAdmin);

        // await groupMemberDoc.create(groupAdmin);

        const group: Group = {
            id: groupIdDoc.id,
            name: groupName,
            type: groupType,
            timeline: groupTimeline,
            ownerId: adminId,
            createdAt: createdAt,
            updatedAt: null,
            status: "active",
            deletedAt: null
        };

        try{
            await batch.commit();
        }catch(error){
            console.log("transaction failed", error);
            throw new Error("Error couldn't create group!");
        }

        // await batch.commit();
        await groupIdDoc.create(group);
        return group;
    }

    async getOneGroup(groupId: string):Promise<Group>{
        const doc = this.db.collection("groups").doc(groupId);

        const ref = await doc.get();

        if(!ref.exists){
            throw new NotFoundException("Group doesn't exist");
        }

        return ref.data() as Group;
    }

    async updateGroupSettings(groupId: string, name: string, groupType: string ):Promise<Group>{
        const doc = this.db.collection("groups").doc(groupId);

        const ref = await doc.get();

        if(!ref.exists){
            throw new NotFoundException("Group doesn't exist");
        }

        // const groupDetails = ref.data() as Group;

        // const groupCreatedAt: string = groupDetails.createdAt;

        await doc.update({ name: name, type: groupType, updatedAt: new Date().toString()
        })

        const refected_ref = doc.get();

        const updatedGroupDetails = (await refected_ref).data();

        return updatedGroupDetails as Group;
    }

    //for updation
    async deactivateGroup(groupId: string):Promise<Group>{
        const doc = this.db.collection("groups").doc(groupId);

        const ref = await doc.get();

        if(!ref.exists){
            throw new NotFoundException("Group doesn't exist");
        }

        const groupDetails = ref.data() as Group;

        const groupCreatedAt: string = groupDetails.createdAt;
        let timeline = groupDetails.timeline;
        let status = groupDetails.status;

        if(status === "inactive"){
            throw new ConflictException("Account already deactivated!");
        }

        const deactivation_timestamp: string = new Date().toString();
        timeline = groupCreatedAt + " - " + deactivation_timestamp;
        status = "inactive";

        await doc.update({
            timeline: timeline,
            status: status,
            updatedAt: new Date().toString()
        });

        const refected_ref = doc.get();

        const updatedGroupDetails = (await refected_ref).data();

        return updatedGroupDetails as Group;
    }

    async reactivateGroup(groupId: string):Promise<Group>{
        const doc = this.db.collection("groups").doc(groupId);

        const ref = await doc.get();

        if(!ref.exists){
            throw new NotFoundException("Group doesn't exist");
        }

        const groupDetails = ref.data() as Group;

        const groupCreatedAt: string = groupDetails.createdAt;
        let timeline = groupDetails.timeline;
        let status = groupDetails.status;

        if(status === "active"){
            throw new ConflictException("Account already active!");
        }

        timeline = groupCreatedAt + " - " + "Present";
        status = "active";


        await doc.update({
            timeline: timeline,
            status: status,
            updatedAt: new Date().toString()
        });

        const refected_ref = doc.get();

        const updatedGroupDetails = (await refected_ref).data();

        return updatedGroupDetails as Group;
    }

    async addMember(groupId: string, memberIds: string[]){
        const groupSnap = await this.db.collection("groups").doc(groupId).get();

        if(!groupSnap.exists){
            throw new NotFoundException("Group not found");
        }

        const batch = this.db.batch();
        // console.log(batch);


        const groupMemberIds = [...memberIds];
        console.log(groupMemberIds);
        // console.log(groupMemberIds);

        for(const currentMemberId of groupMemberIds){
            const groupMemberRef = this.db.collection("groupMembers").doc(`${currentMemberId}_${groupId}`);

            batch.create(groupMemberRef, this.groupMemberBuilder(groupId, currentMemberId, "member") );
        }

    
        try{
            await batch.commit();
        }catch(error){
            // console.log("transaction failed", error);
            throw new Error("Error couldn't add members");
        }
        
    }

    async leaveGroup(groupId: string, memberId):Promise<void>{
        const groupMemberDoc = this.db.collection("groupMembers").doc(`${memberId}_${groupId}`);

        const ref = groupMemberDoc.get();
        
        if(!(await ref).exists){
            throw new NotFoundException("This user is not the member of this group");
        }

        await groupMemberDoc.delete();

    }

    async removeMember(groupId: string, adminId: string, memberId: string){
        const groupAdminDoc = this.db.collection("groupMembers").doc(`${adminId}_${groupId}`);

        const groupMemberDoc = this.db.collection("groupMembers").doc(`${memberId}_${groupId}`);

        const groupMemberSnap = await groupMemberDoc.get();

        const groupAdminSnap = await groupAdminDoc.get();

        if(!groupAdminSnap.exists){
            throw new NotFoundException("Group Admin  or the Group doesn't exist");
        }

        const ref = groupAdminSnap.data() as GroupMember;

        if(ref.role !== "admin"){
            return
        }

        if(!groupMemberSnap.exists){
            throw new NotFoundException("User not the member of this group")
        }

        groupMemberDoc.delete();

    }
}