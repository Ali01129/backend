import { Injectable, Inject, ConflictException, NotFoundException, BadRequestException } from "@nestjs/common";
import { Firestore, Query, Transaction } from "firebase-admin/firestore";
import { FIRESTORE } from "../Firebase/firebase.module";
import { Friend } from "./friends.types";
import { User } from "../users/user.types";
import { SearchFriendDto } from "./dto/search-friend.dto";
import { request } from "http";
import { Filter } from 'firebase-admin/firestore';
import {friendReqInfo, friendInfo} from "./friends.types"

// import ConflictException from 
// import { collection, query, where } from "firebase/firestore";

@Injectable()
export class FriendsService {
    constructor(@Inject(FIRESTORE) private readonly db: Firestore){}

    // async search(filter: SearchFriendDto): Promise<User> {
    //     const { id, email, handle } = filter;

    //     let query: Query = this.db.collection("users").where("deletedAt", "==", null);

    //     if(id) query = query.where("id", "==", id);
        
    //     if(email) query = query.where("email", "==", email);

    //     if(handle) query = query.where("handle", "==", handle);
        
    //     if(!query){
    //         throw new Error("User not found");
    //     }

    //     const userDocument = await query.get();

    //     return userDocument;
    // }

    async search(filter: SearchFriendDto): Promise<User[]> {
        const { id, email, handle } = filter;

        // collect one condition per provided field
        const conditions: Filter[] = [];
        if (id) conditions.push(Filter.where('id', '==', id));
        if (email) conditions.push(Filter.where('email', '==', email.toLowerCase()));
        if (handle) conditions.push(Filter.where('handle', '==', handle));

        if (!conditions.length) {
            throw new BadRequestException('Provide an id, email or handle');
        }

        const snap = await this.db
            .collection('users')
            .where(Filter.or(...conditions)) // matches ANY of the conditions
            .get();

        // filter out soft-deleted users in code (avoids needing an extra index)
        const users = snap.docs
            .map((doc) => doc.data() as User)
            .filter((user) => !user.deletedAt);

        if (!users.length) {
            throw new NotFoundException('User not found');
        }

        return users;
    }

    async sendFriendRequest(userId: string, friendId: string): Promise<Friend | void> {
        if (userId === friendId){
            throw new Error("You can not send a Friend Request to yourself");
        }
        // const existingRequest = this.db.collection("friends").doc() 

        const userRef = this.db.collection("users").doc(userId);
        const friendRef = this.db.collection("users").doc(friendId);

        const friendshipId = [userRef.id,friendRef.id].sort().join("_");
        console.log(friendshipId);


        const pairFriendIdRef = this.db.collection("friends").doc(friendshipId);

        return this.db.runTransaction(async (transaction) => {
            const [userIdSnap, friendIdSnap, friendshipIdSnap] = await Promise.all([
                await transaction.get(userRef),
                await transaction.get(friendRef),
                await transaction.get(pairFriendIdRef)
            ]);

            if(!userIdSnap.exists || userIdSnap.data()?.deletedAt !== null){
                throw new NotFoundException("sender doesn't exist");
            }
            if(!friendIdSnap.exists || friendIdSnap.data()?.deletedAt !== null){
                throw new NotFoundException("User you are trying to send request doesn't exist");
            }
            if(friendshipIdSnap.data()?.status === "accepted"){
                throw new ConflictException("Aleady a friend");
            }
            if(friendshipIdSnap.data()?.status === "pending"){
                throw new ConflictException("Aleady sent a request");
            }

            const request: Friend = {
                id: pairFriendIdRef.id,
                userId: userId,
                friendId: friendId,
                status: "pending",
                createdAt: new Date().toString(),
                updatedAt: null,
                removedAt: null }

            transaction.set(pairFriendIdRef, request);

            return request;
        });
    }

    async acceptFriendRequest(sentBy: string, sentTo: string, friendRequestId: string): Promise<Pick<Friend, "id" | "createdAt" | "updatedAt" | "status">> {
        const requestRef = this.db.collection("friends").doc(friendRequestId);

        const requestSnapshot = (await requestRef.get()).data() as Friend;

        if(requestSnapshot.userId === sentBy && requestSnapshot.friendId === sentTo && requestSnapshot.status === "pending"){
            requestRef.update({...requestSnapshot,  status: "accepted", updatedAt: new Date(), removedAt: null });
        }else if (requestSnapshot.userId !== sentBy){
            throw new NotFoundException("Sender Id is wrong");
        }else if(requestSnapshot.friendId !== sentTo){
            throw new NotFoundException("Reciever Id is wrong");
        }else if(requestSnapshot.userId === sentBy && requestSnapshot.friendId === sentTo && requestSnapshot.status === "accepted"){
            throw new ConflictException("Already a friend");
        }else if(requestSnapshot.userId === sentBy && requestSnapshot.friendId === sentTo && requestSnapshot.status === "decline"){
            throw new ConflictException("Friend Request was decline");
        }

        const updatedRequest = (await requestRef.get()).data() as Friend;

        return {
            id: updatedRequest.id,
            createdAt: updatedRequest.createdAt,
            updatedAt: updatedRequest.updatedAt,
            status: updatedRequest.status,
        };
    }

    async declineFriendRequest(requestId: string):Promise<Pick<Friend, "friendId" | "status">>{
        const requestRef  = this.db.collection("friends").doc(requestId);

        const requestData = await requestRef.get();

        if(!requestData.id){
            throw new NotFoundException("The request doesn't exist");
        }

        if(requestData.data()!.status === "pending"){
            requestRef.update({
                status: "decline",
                updatedAt: new Date().toString()
            });
        }

        const updatedRequest = (await requestRef.get()).data() as Friend;

        return {
            friendId: updatedRequest.friendId,
            status: updatedRequest.status,
        };
    }

    async removeFriend(userId: string, friendUserId: string):Promise<void>{
        const friendshipId = [userId, friendUserId].sort().join("_");

        const friendshipRef = this.db.collection("friends").doc(friendshipId);

        return this.db.runTransaction(async (transaction) => {
            const friendshipDocSnap = await transaction.get(friendshipRef);

            if (!friendshipDocSnap.exists) {
                throw new NotFoundException("Not your friend!");
            }

            const friendship = friendshipDocSnap.data() as Friend;


            if(friendship.status !== "accepted" ){
                throw new ConflictException("You are not friends!")
            }
            
            transaction.delete(friendshipRef);
        })
    }

    async listFriendRequests(userId: string , direction: "incoming" | "outgoing" | "all"):Promise<(friendReqInfo & {direction : "incoming" | "outgoing" | "all"})[]>{
        const friendsCollection = this.db.collection("friends");
        // const usersCollection = this.db.collection("users").doc(userId);

        // const username = await usersCollection.get();

        // const friendIdRef = await friendCollection.get();
        
        const incomingRequests = () => friendsCollection.where( "friendId" , "==" , userId).where( "status", "==" ,"pending").get();
        
        const outgoingRequests = () => friendsCollection.where( "userId" , "==" , userId).where( "status", "==" ,"pending").get();
        
        const requestsList: (friendReqInfo & {direction: "incoming" | "outgoing" | "all"})[] = [];

        if(direction === "incoming" || direction === "all" ){
            const incomingDocSnap  = await incomingRequests();
            incomingDocSnap.forEach(element => {
                // const data = element.data() as friendReqInfo;

                requestsList.push({ ...(element.data() as friendReqInfo) , direction: "incoming" })
            });
        }
        if(direction === "outgoing" || direction === "all"){
            const outgoingDocSnap  = await outgoingRequests();
            outgoingDocSnap.forEach(element => {
                requestsList.push({...(element.data() as friendReqInfo) , direction: "outgoing" })
            });
        }
        // if(direction === "all"){
        //     const incomingDocSnap  = await incomingRequests;
        //     incomingDocSnap.forEach(element => {
        //         requestsList.push({...(element.data() as Friend) , direction: "incoming" })
        //     });
        //     const outgoingDocSnap  = await outgoingRequests;
        //     outgoingDocSnap.forEach(element => {
        //         requestsList.push({...(element.data() as Friend) , direction: "outgoing" })
        //     });
        // }

        return requestsList;

    }


}