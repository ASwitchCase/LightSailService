import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { InstanceModel } from "../Models/InstanceModel";
import { ILSInstanceRepository } from "./ILSInstanceRepository";

export class LSInstanceDynamoRepository implements ILSInstanceRepository{
    private table_name : string
    constructor(private db : DynamoDB){
        this.table_name = "lightsail-lab-instance-table"
    }

    /**
     * 
     * @param id 
     * @returns LS instance
     */
    async getInstance(id: string): Promise<InstanceModel> {
        var res = await this.db.getItem({
            TableName: this.table_name,
            Key : {
                id: {S:id}
            }
        })

        return {
            id : res.Item?.id.S!,
            zone : res.Item?.zone.S!,
            bundle_id : res.Item?.bundle_id.S!,
            blueprint_id : res.Item?.blueprint_id.S!
        }
    }

    /**
     * 
     * @returns list of LS instances
     */
    async getAllInstances(): Promise<InstanceModel[]> {
        var res : InstanceModel[] = []

        var scan = await this.db.scan({
            TableName:this.table_name
        })

        scan.Items?.forEach(item =>{
            res.push({
                id : item?.id.S!,
                zone : item?.zone.S!,
                bundle_id : item?.bundle_id.S!,
                blueprint_id : item?.blueprint_id.S!
            })
        })

        return res
    }
    /**
     * 
     * @param instance 
     * @returns LS instance
     */
    async addInstance(instance: InstanceModel): Promise<InstanceModel> {
        await this.db.putItem({
            TableName : this.table_name,
            Item : {
                id : {S:instance.id},
                zone : {S:instance.zone},
                bundle_id :{S:instance.bundle_id},
                blueprint_id :{S:instance.blueprint_id}
            }
        },(err,data)=>{
            if(err) return new Error(err)
        })

        return instance
    }
    async deleteInstance(id: string): Promise<void> {
        await this.db.deleteItem({
            TableName: this.table_name,
            Key: {
                id : {S:id}
            }
        })
    }
    
}