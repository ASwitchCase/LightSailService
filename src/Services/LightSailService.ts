import { LightsailClient, CreateInstancesCommand, CreateInstancesCommandOutput, CreateDiskCommandOutput, CreateDiskCommand, AttachDiskCommand, AttachDiskCommandOutput, GetOperationCommand, GetInstanceCommand, InstanceState } from "@aws-sdk/client-lightsail"; // ES Modules import
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
            instanceName:instanceName
        })

        await this.client.send(command)
        
    }

    async waitForInstanceRunning(name : string){
        const command = new GetInstanceCommand({
            instanceName:name
        })

        while(true){
            const res = await this.client.send(command)
                .then(data =>{
                    console.log(data.instance?.state?.name)
                    if(data.instance?.state?.name === "running"){
                        return
                    }
                })
            sleep(10000)
        }
    }
}