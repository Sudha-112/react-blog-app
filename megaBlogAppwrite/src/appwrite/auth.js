import conf from "../conf/conf";
import {Client, Account, ID} from "appwrite";

export class AuthService{

    client = new Client();  // makes connection with appwrite server
    account;

    constructor(){
        this.client
        .setEndpoint(conf.appWriteUrl)
        .setProject(conf.appWriteProjectId);
        this.account = new Account(this.client);
    }

    //signup
    async createAccount({email, password, name}){
        try{
            const userAccount = await this.account.create({
               userId: ID.unique(),
               email: email,
               password: password,
               name: name
            });

            if(userAccount){
               // call another method
               return this.login({email, password});
            }else{
                return userAccount;
            }
        }catch(error){
           console.log("Appwrite service :: signup :: error" ,error);
           throw error;
        }
    }

    //login
    async login({email,password}){
        try{
        return await this.account.createEmailPasswordSession({
            email: email, 
            password: password
        });
        }catch(error){
            console.log("Appwrite service :: login :: error" ,error);
            throw error;
        }
    }

    // check-user-logged-in
    async getCurrentUser(){
        try{
           return await this.account.get();
        }catch(error){
           console.log("Appwrite service :: getCurrentUser :: error", error);
        }

        return null;
    }

    // user-logout
   async logout(){

    try{
        await this.account.deleteSessions();
        return true;
    }catch(error){
        console.log("Appwrite service :: logout :: error", error);
        return false;
    }
   }
}

const authService = new AuthService();

export default authService;