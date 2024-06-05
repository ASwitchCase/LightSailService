import { LightsailClient, CreateInstancesCommand, CreateInstancesCommandOutput, CreateDiskCommandOutput, CreateDiskCommand, AttachDiskCommand, AttachDiskCommandOutput } from "@aws-sdk/client-lightsail"; // ES Modules import
import { InstanceModel } from "../Models/InstanceModel";
import { SETTINGS } from "../Utils/Tools";
import { DiskModel } from "../Models/DiskModel";

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
                    addOnType: "AutoSnapshot",
                    autoSnapshotAddOnRequest: {
                        snapshotTimeOfDay: "05:00"
                    },
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
    async createDisk(disk : DiskModel) : Promise<CreateDiskCommandOutput>{
        const command = new CreateDiskCommand({
            diskName:disk.name,
            availabilityZone:disk.availability_zone,
            sizeInGb:disk.block_size
        })

        return await this.client.send(command)
    }

    /**
     * 
     * @param diskName 
     * @param instanceName 
     * @returns Command Output
     */
    async attachDisk(diskName : string, instanceName : string) : Promise<AttachDiskCommandOutput>{
        const command = new AttachDiskCommand({
            diskName:diskName,
            diskPath:"/dev/xvdf",
            instanceName:instanceName
        })

        return await this.client.send(command)
        
    }
}