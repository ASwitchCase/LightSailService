import { LightsailClient, CreateInstancesCommand, CreateInstancesCommandOutput, CreateDiskCommandOutput, CreateDiskCommand, AttachDiskCommand, AttachDiskCommandOutput, GetOperationCommand, GetInstanceCommand, InstanceState, GetDiskCommand, DiskState } from "@aws-sdk/client-lightsail"; // ES Modules import
import { InstanceModel } from "../Models/InstanceModel";
import { SETTINGS } from "../Utils/Tools";
import { DiskModel } from "../Models/DiskModel";
import { sleep } from "../Utils/Sleep";

export class LightSailService {
    constructor(private client : LightsailClient){}

    /**
     * 
     * @param instance 
     * @param name 
     * @returns Command Output
     */
    async createInstance(instance : InstanceModel) : Promise<CreateInstancesCommandOutput> {
        const command = new CreateInstancesCommand({
            instanceNames:[instance.name],
            availabilityZone: instance.zone,
            bundleId:instance.bundle_id,
            blueprintId:instance.blueprint_id,
            addOns:[
               {
                    addOnType: "StopInstanceOnIdle",
                    stopInstanceOnIdleRequest: {
                        duration: "15",
                        threshold: "10"
                    }
               },
               
            ]
        })

        return await this.client.send(command)
    }

    async createInstanceAndWait(instance : InstanceModel){

        await this.createInstance(instance)

        return new Promise(async (resolve,reject) =>{
            let trys = 0
            while(await this.checkInstanceStatus(instance.name) !== 'running'){
                trys += 1
                console.log(this.checkInstanceStatus(instance.name))
                sleep(5000)
                if(trys === 6) break
            }
            if(trys === 6) reject()
            resolve("worked")
        })
    }

    async createDiskAndWait(disk : DiskModel){

        await this.createDisk(disk)

        return new Promise(async (resolve,reject) =>{
            let trys = 0
            while(await this.checkDiskStatus(disk.name) !== DiskState.Available){
                trys += 1
                console.log(this.checkDiskStatus(disk.name))
                sleep(5000)
                if(trys === 6) break
            }
            if(trys === 6) reject()
            resolve("worked")
        })
    }

    /**
     * 
     * @param disk 
     * @returns Command Output
     */
    async createDisk(disk : DiskModel) : Promise<void>{
        const command = new CreateDiskCommand({
            diskName:disk.name,
            availabilityZone:disk.availability_zone,
            sizeInGb:disk.block_size
        })

        const res = await this.client.send(command)
        
    }

    /**
     * 
     * @param diskName 
     * @param instanceName 
     * @returns Command Output
     */
    async attachDisk(diskName : string, instanceName : string) : Promise<void>{
        const command = new AttachDiskCommand({
            diskName:diskName,
            diskPath:"/dev/xvdf",
            instanceName:instanceName,
            autoMounting: true
        })

        await this.client.send(command)
        
    }

    async checkInstanceStatus(name : string){
        const command = new GetInstanceCommand({
            instanceName:name
        })
        let status;

        await this.client.send(command)
            .then(data =>{
                status = data.instance?.state?.name
            })
        
        return status
        
    }

    async checkDiskStatus(name : string){
        const command = new GetDiskCommand({
            diskName:name
        })
        let status;

        await this.client.send(command)
            .then(data =>{
                status = data.disk?.state
            })
        
        return status
        
    }
}