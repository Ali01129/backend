import { Inject, Injectable } from "@nestjs/common";
import { User } from "./user.types";
import { FIRESTORE } from "../Firebase/firebase.module";
import { Firestore } from "firebase-admin/firestore";

@Injectable()
export class UserService{
    constructor( @Inject(FIRESTORE) private readonly db: Firestore){}
    
    async create(data: Omit<User, "id" | "createdAt" | "updatedAt" >): Promise<User | any>{
        
        const document_ref = this.db.collection("users").doc();   // doc auto genrates id 

        const user: User = {...data, id:  document_ref.id, createdAt: new Date().toString(), updatedAt: null };       

        const user_created = await document_ref.set(user);
        
        return user_created;
    }

    async getAllUsers(): Promise<User[]>{
        const usersSnapshot = await this.db.collection("users").get();
        const users: User[] = [];

        usersSnapshot.forEach((document) => {
            const userData = document.data() as User;
            users.push(userData);
        })
        return users;
    }

    async getUserById(id: string): Promise<User | null> {
        const userDocument = await this.db.collection("users").doc(id).get();

        return userDocument.exists ? (userDocument.data() as User) : null;
    }


}