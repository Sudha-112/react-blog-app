import conf from "../conf/conf";
import { Client, ID, TablesDB, Storage, Query } from "appwrite";

export class Service{

    client = new Client();
    databases;
    bucket;

    constructor(){
        this.client
        .setEndpoint(conf.appWriteUrl)
        .setProject(conf.appWriteProjectId);
        this.databases = new TablesDB(this.client);  //DB operations ke liye
        this.bucket = new Storage(this.client);      //File operations ke liye
    }

    //Post services
     
    //create post service
    async createPost({title, slug, content, featuredImage,status,userId}){
        try{
            return await this.databases.createRow(
               {
            databaseId: conf.appWriteDatabaseId,
            tableId: conf.appWriteCollectionId,
            rowId: slug,
            data: {
                title,
                content,
                featuredImage,
                status,
                userId,
            }
        }
            )
        }catch(error){
          console.log("Appwrite service :: createPost :: error", error);
        }
    }

    //update post service
    async updatePost(slug , {title, content, featuredImage, status}){
        try{
          return await this.databases.updateRow({
             databaseId: conf.appWriteDatabaseId,
             tableId: conf.appWriteCollectionId, 
             rowId: slug,
             data: {
                    title,
                    content, 
                    featuredImage, 
                    status,

                }
         })
        }catch(error){
              console.log("Appwrite service :: updatePost :: error", error);
        
        }
    }

    //delete post service
    async deletePost(slug){
        try{
            await this.databases.deleteRow({
               databaseId: conf.appWriteDatabaseId,
               tableId: conf.appWriteCollectionId, 
               rowId: slug})
            return true;

        }catch(error){
            console.log("Appwrite service :: deletePost :: error", error);
            return false;
        }
    }

    //get post service
    async getPost(slug){
        try{
            return await this.databases.getRow({
               databaseId: conf.appWriteDatabaseId,
               tableId: conf.appWriteCollectionId, 
               rowId: slug})

        }catch(error){
            console.log("Appwrite service :: getPost :: error", error);
            return false;
        }
    }

    // get posts service
    async getPosts(queries = [Query.equal("status", "active")]){
        try{
            return await this.databases.listRows({
                 databaseId: conf.appWriteDatabaseId,
                 tableId: conf.appWriteCollectionId,
                 queries: queries
        })
        }catch(error){
             console.log("Appwrite service :: getPosts :: error", error);
             return false;
        }
    }


    //File services 

    //file upload service
    async uploadFile(file){
        try{
            return await this.bucket.createFile({
                bucketId: conf.appWriteBucketId,
                fileId: ID.unique(),
                file: file
        })
        }catch(error){
            console.log("Appwrite service :: uploadFile ::error", error);
            return false;
        }
    }

    //delete file service
    async deleteFile(fileId){
        try{
            await this.bucket.deleteFile({
               bucketId: conf.appWriteBucketId,
               fileId: fileId
        })
             return true;
        }catch(error){
            console.log("Appwrite service :: deleteFile :: error", error);
            return false;
        }
    }

    //preview file service
    getFilePreview(fileId){
        return this.bucket.getFileView({
           bucketId: conf.appWriteBucketId,
           fileId: fileId
    })

    }
}

const service = new Service();                         
                                                            
export default service; 