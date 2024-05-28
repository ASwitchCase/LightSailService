import { DynamoDB, ScanCommandOutput} from "@aws-sdk/client-dynamodb";
import { IUserAccountRepository } from "./IUserAccountRepository";
import { UserAccountModel } from "../Models/UserAccountModel";

export class UserAccountDynamoRepository implements IUserAccountRepository {
    constructor(private db : DynamoDB,private table_name : string){}

    /**
     * 
     * @param id string
     * @returns Promise<UserAccountModel>
     */
    async getUser(id: string): Promise<UserAccountModel> {
        var res = await this.db.getItem({
            TableName:this.table_name,
            Key : {
                id : {S:id}
            }
        })
        
        return {
            username: res.Item?.username.S!,
            assigned_disk: res.Item?.assigned_disk.S!,
            assigned_instance:res.Item?.assigned_instance.S!,
            id: res.Item?.id.S!
        }
    }

    /**
     * 
     * @returns List of Users
     */
    async getAllUsers(): Promise<UserAccountModel[]> {
        var res : UserAccountModel[] = []

        var scan = await this.db.scan({
            TableName: this.table_name
        })
        
        scan.Items?.forEach(item =>{
            res.push({
                id: item?.id.S!,
                username: item?.username.S!,
                assigned_instance: item?.assigned_instance.S!,
                assigned_disk: item?.assigned_disk.S!
            })
        })
        return res
    }

    /**
     * 
     * @param id 
     * @param user 
     */
    async updateUser(id: string, user: UserAccountModel): Promise<UserAccountModel> {
        await this.db.updateItem({
            TableName: this.table_name,
            Key : {
                id : {S: id}
            },
            UpdateExpression:"set username = :username, assigned_instance = :assigned_instance, assigned_disk = :assigned_disk",
            ExpressionAttributeValues: {
                ":username":{S:user.username},
                ":assigned_instance":{S:user.assigned_instance},
                ":assigned_disk":{S:user.assigned_disk}
            }
        }) 
        
        return user
    }

    /**
     * 
     * @param UserAccountModel
     * @returns Promise<UserAccountModel>
     */
    async addUser(user: UserAccountModel): Promise<UserAccountModel> {
        await this.db.putItem({
            TableName: this.table_name,
            Item:{
                id : {S:user.id},
                username : {S:user.username},
                assigned_instance : {S:user.assigned_instance},
                assigned_disk : {S:user.assigned_disk}
            }
        },(err,data)=>{
            if(err) return new Error(err)
        }) 
        return user
    }

    /**
     * 
     * @param id 
     */
    async deleteUser(id: string): Promise<void> {
        await this.db.deleteItem({
            TableName: this.table_name,
            Key: {
                id : {S : id}
            }
        })
    }
}