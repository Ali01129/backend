import { Inject, Injectable } from "@nestjs/common";
import { User } from "./user.types";
import { FIRESTORE } from "../Firebase/firebase.module";
import { Firestore } from "firebase-admin/firestore";
import { AnyCatcher } from "rxjs/internal/AnyCatcher";


@Injectable()
export class UserService{
    constructor( @Inject(FIRESTORE) private readonly db: Firestore){}
    
    async create(data: Omit<User, "id" | "createdAt" | "updatedAt" | "deletedAt">): Promise<User | any>{
        try{
            const document_ref = this.db.collection("users").doc();   // doc auto genrates id 

            const user: User = {...data, id:  document_ref.id, createdAt: new Date().toString(), updatedAt: null, deletedAt: null};  
            
            // if(user.email === email){
            //     throw new Error("User already exists.");
            // }

            const user_created = await document_ref.set(user);
            
            return user_created;

        }catch(error){
            console.error("Error creating user:", error);
            throw new Error("Failed to create user");
        }
    }

    async getAllUsers(includeDeleted?: boolean): Promise<User[]>{
        const usersSnapshot = await this.db.collection("users").get();
        const users: User[] = [];

        usersSnapshot.forEach((document) => {
            const userData = document.data() as User;
            if(includeDeleted === true){
                if(userData.deletedAt !== null || userData.deletedAt === null){
                    users.push(userData);
                }
            }else{
                userData.deletedAt === null && users.push(userData);
            }
        })
        // usersSnapshot.forEach((document) => {
        //     const userData = document.data() as User;
        //     users.push(userData);
        // })
        return users;
    }

    async getUserById(id: string): Promise<User | null> {
        const userDocument = await this.db.collection("users").doc(id).get();

        return userDocument.exists ? (userDocument.data() as User) : null;
    }

    async deleteUserById(id: string): Promise<void> {
        const userDocument = await this.db.collection("users").doc(id).get();

        if(!userDocument.exists){
            // await this.db.collection("users").doc(id).delete();
            throw new Error("User not found");
        }
        await this.db.collection("users").doc(id).update({deletedAt: new Date().toString()});
        return;
    }
    
    async updateUserById(id: string, data: Partial<Pick<User, "name" | "email" | "displayName" | "handle" | "avatarColor" | "preferredCurrency" | "subscriptionStatus" | "verified" | "deletedAt" >>): Promise<User> {

        this.db.settings({ ignoreUndefinedProperties: true });
        const userRef = await this.db.collection("users").doc(id); //reference 

        const userDocument = await userRef.get();

        if (!userDocument.exists || userDocument.data()?.deletedAt !== null) {
            throw new Error("User not found");
        }

        await userRef.update({ ...data, updatedAt: new Date().toString() }); //update userdata using reference

        const updatedUser = await userRef.get();

        return updatedUser.data() as User;
    }

}