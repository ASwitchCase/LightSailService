import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DiskModel} from "../Models/DiskModel";
import { IDiskRepository } from "./IDiskRepository";

export class DiskDynamoRepository implements IDiskRepository {
    private table_name : string
    constructor(private db : DynamoDB){
        this.table_name = 'lightsail-lab-disk-table'
    }
    /**
     * 
     * @param id 
     * @returns disk
     */
    async getDisk(id: string): Promise<DiskModel> {
        var res = await this.db.getItem({
            TableName:this.table_name,
            Key : {
                id : {S:id}
            }
        })

        return {
            id : res.Item?.username.S!,
            name : res.Item?.name.S!,
            availability_zone : res.Item?.availability_zone.S!,
            block_size : Number(res.Item?.block_size.S!)
        }
    }
    
    /**
     * 
     * @returns List of Disks
     */
    async getAllDisks(): Promise<DiskModel[]> {
        var res : DiskModel[]= []

        var scan = await this.db.scan({
            TableName: this.table_name
        })

        scan.Items?.forEach(item =>{
            res.push({
                id : item?.id.S!,
                name: item?.name.S!,
                availability_zone : item?.availability_zone.S!,
                block_size: Number(item?.block_size.S!)
            })
        })

        return res
    }

    /**
     * 
     * @param disk 
     * @returns disk
     */
    async addDisk(disk: DiskModel): Promise<DiskModel> {
        await this.db.putItem({
            TableName: this.table_name,
            Item: {
                id : {S:disk.id},
                name: {S:disk.name},
                availability_zone : {S:disk.availability_zone},
                block_size: {S:String(disk.block_size)}
            }
        },(err,data)=>{
            if(err) return new Error(err)
        })

        return disk
    }
    async deleteDisk(id: string): Promise<void> {
        await this.db.deleteItem({
            TableName: this.table_name,
            Key: {
                id : {S : id}
            }
        })
    }

}