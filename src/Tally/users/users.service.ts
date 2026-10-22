import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./types/create-user.types";
import { FIRESTORE } from "../Firebase/firebase.module";
import { Firestore } from "firebase-admin/firestore";
import { updateUser } from "./types/update-user.types";
import { Filter } from 'firebase-admin/firestore';


@Injectable()
export class UserService{
    constructor( @Inject(FIRESTORE) private readonly db: Firestore){}
    
    async create(
        name: string,
        email: string,
        displayName: string,
        handle: string,
        avatarColor: string,
        verified: boolean,
        preferredCurrency: string,
        subscriptionStatus: boolean): Promise<User>{
        const userDoc = this.db.collection("users").doc();

        userDoc.create({
            id: userDoc.id,
            name: name,
            email: email,
            displayName: displayName,
            handle: handle,
            avatarColor: avatarColor,
            verified: verified,
            preferredCurrency: preferredCurrency,
            subscriptionStatus: subscriptionStatus, 
            createdAt: new Date().toString(),
            updatedAt: null,
            deletedAt: null
        });
        
        const createdUser = (await userDoc.get()).data() as User;
        
        return createdUser;

    }

    async getAllUsers(showDeleted?: boolean): Promise<User[]>{ //change function name 
        // const activeUsers = `"deletedAt","==" , null`;
        // const inactiveUsers = `"deletedAt","!=" , null`;
        
        const operator = showDeleted ? "!=" : "=="; 

        // const filter = includeDeleted ? activeUsers : inactiveUsers;
        // thought about Json parse but
        // where take 3 arguments can't pass in a single variable or string 

        const usersSnapshot = await this.db.collection("users").where("deletedAt", operator, null).get();

        const users: User[] = [];

        usersSnapshot.forEach((document) => {
            const userData = document.data() as User;
            users.push(userData);   
        });
        
        return users;
    }

    async searchUser(id?: string , name?: string , email?: string): Promise<User> {
        const filter: Filter[] = [];

        if(id) filter.push(Filter.where("id" , "==" , id));
        if(name) filter.push(Filter.where("name" , "==" , name));
        if(email) filter.push(Filter.where("email" , "==" , email));
        
        if(filter.length === 0){
            throw new ConflictException("Aleast one thing should be provided");
        }

        const userDocument = this.db.collection("users").where(Filter.or(...filter));

        const userFound = await userDocument.get();
        
        if(userFound.empty){
            throw new NotFoundException("User not found!");
        }

        const userData = userFound.docs[0];
        // console.log(userData);
        return { id: userData.id , ...userData.data()} as User;
    }

    async deleteUserById(id: string): Promise<string> {
        const userDocument = await this.db.collection("users").doc(id).get();

        if(!userDocument.exists){
            throw new Error("User not found");
        }

        await this.db.collection("users").doc(id).update({deletedAt: new Date().toString()});

        return userDocument.id;
    }
    
    async updateUserById(id: string, data: updateUser): Promise<User> {

        this.db.settings({ignoreUndefinedProperties : true});

        const userRef = this.db.collection("users").doc(id); //reference  //

        const userDocument = await userRef.get();

        if (!userDocument.exists || userDocument.data()?.deletedAt !== null) {
            throw new Error("User not found");
        }

        await userRef.update({ ...data, updatedAt: new Date().toString() }); //update userdata using reference

        const updatedUser = await userRef.get();

        return {...updatedUser.data()} as User;
    }

}

