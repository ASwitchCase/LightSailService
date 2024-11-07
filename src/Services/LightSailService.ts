import { LightsailClient, CreateInstancesCommand, CreateInstancesCommandOutput, CreateDiskCommandOutput, CreateDiskCommand, AttachDiskCommand, AttachDiskCommandOutput, GetOperationCommand, GetInstanceCommand, InstanceState, GetDiskCommand, DiskState, DeleteAlarmCommand, DeleteInstanceCommand, DeleteDiskCommand, CloseInstancePublicPortsCommand, CreateInstancesFromSnapshotCommand, CreateDiskFromSnapshotCommand } from "@aws-sdk/client-lightsail"; // ES Modules import
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
     * TODO: Add auto snapshots
     */
    async createInstance(instance : InstanceModel) : Promise<CreateInstancesCommandOutput> {
        const command = new CreateInstancesCommand({
            instanceNames:[instance.name],
            availabilityZone: instance.zone,
            bundleId:instance.bundle_id,
            blueprintId:instance.blueprint_id,
            tags:[
                {
                    key:'shu:username',
                    value:instance.name
                }
            ],
            addOns:[
               {
                    addOnType: "StopInstanceOnIdle",
                    stopInstanceOnIdleRequest: {
                        duration: "20",
                        threshold: "5"
                    }
               },
               {
                    addOnType:"AutoSnapshot",
                    autoSnapshotAddOnRequest:{
                        snapshotTimeOfDay:"05:00"
                    }
               }
               
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
                console.log(`Creating instance ${instance.name}...`)
                sleep(5000)
                if(trys === 6) break
            }
            if(trys === 6){
                console.log(`Failed to create instance ${instance.name}`)
                reject()
            }
            this.closeInstancePorts(instance.name)
            console.log(`Instance ${instance.name} created`)
            resolve("worked")
        })
    }

    async createInstanceFromSnapShot(snapshot_name : string,instance : {name:string,zone:string,bundle_id:string}){
        const command = new CreateInstancesFromSnapshotCommand({
            instanceNames:[instance.name],
            availabilityZone:instance.zone,
            bundleId:instance.bundle_id,
            instanceSnapshotName:snapshot_name,
            tags:[
                {
                    key:'shu:username',
                    value:instance.name
                }
            ],
            addOns:[
               {
                    addOnType: "StopInstanceOnIdle",
                    stopInstanceOnIdleRequest: {
                        duration: "20",
                        threshold: "5"
                    }
               },
               {
                    addOnType:"AutoSnapshot",
                    autoSnapshotAddOnRequest:{
                        snapshotTimeOfDay:"05:00"
                    }
               }
            ]
        }) 

        const res = await this.client.send(command)
        return res
    }

    async createInstanceFromSnapshotAndWait(snapshot_name : string,instance : {name:string,zone:string,bundle_id:string}){
        await this.createInstanceFromSnapShot(snapshot_name,instance)

        return new Promise(async (resolve,reject) =>{
            let trys = 0
            while(await this.checkInstanceStatus(instance.name) !== 'running'){
                trys += 1
                console.log(`Creating instance ${instance.name}...`)
                sleep(5000)
                if(trys === 6) break
            }
            if(trys === 6){
                console.log(`Failed to create instance ${instance.name}`)
                reject()
            }
            this.closeInstancePorts(instance.name)
            console.log(`Instance ${instance.name} created`)
            resolve("worked")
        })
    }

    async createDiskFromSnapshotAndWait(snapshot_name:string, disk: DiskModel){
        await this.createDiskFromSnapshot(snapshot_name,disk)

        return new Promise(async (resolve,reject) =>{
            let trys = 0
            while(await this.checkDiskStatus(disk.name) !== DiskState.Available){
                trys += 1
                console.log(`Creating disk ${disk.name}...`)
                sleep(5000)
                if(trys === 6) break
            }
            if(trys === 6){
                console.log(`Failed to create disk ${disk.name}`)
                reject()
            }
            console.log(`Disk ${disk.name} created`)
            resolve("worked")
        })
    }

    async createDiskFromSnapshot(snapshot_name:string, disk: DiskModel){
        const command = new CreateDiskFromSnapshotCommand({
            diskName:disk.name,
            diskSnapshotName:snapshot_name,
            availabilityZone:disk.availability_zone,
            sizeInGb:disk.block_size,
            tags:[
                {
                    key:'shu:username',
                    value:disk.name
                }
            ],
            addOns:[
                {
                     addOnType:"AutoSnapshot",
                     autoSnapshotAddOnRequest:{
                         snapshotTimeOfDay:"05:00"
                     }
                },
                
            ]
        })

        return await this.client.send(command)
    }

    async closeInstancePorts(name:string){
        const command = new CloseInstancePublicPortsCommand({
            instanceName:name,
            portInfo:{
                cidrs:["0.0.0.0/0"],
                fromPort:22,
                protocol:"tcp",
                toPort:22
            }
        })
        const res = await this.client.send(command)
        return res
    }

    async createDiskAndWait(disk : DiskModel){

        await this.createDisk(disk)

        return new Promise(async (resolve,reject) =>{
            let trys = 0
            while(await this.checkDiskStatus(disk.name) !== DiskState.Available){
                trys += 1
                console.log(`Creating disk ${disk.name}...`)
                sleep(5000)
                if(trys === 6) break
            }
            if(trys === 6){
                console.log(`Failed to create disk ${disk.name}`)
                reject()
            }
            console.log(`Disk ${disk.name} created`)
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
            sizeInGb:disk.block_size,
            addOns:[
                {
                     addOnType:"AutoSnapshot",
                     autoSnapshotAddOnRequest:{
                         snapshotTimeOfDay:"05:00"
                     }
                },
                
            ]
        })

        const res = await this.client.send(command)
        
    }

    /**
     * 
     * @param diskName 
     * @param instanceName 
     * @returns Command Output
     */
    async attachDisk(diskName : string, instanceName : string,path:string) : Promise<void>{
        const command = new AttachDiskCommand({
            diskName:diskName,
            diskPath:path,
            instanceName:instanceName,
            autoMounting: true
        })

        console.log(`Attached disk ${diskName} to instance ${instanceName}`)
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

    async DeleteInstance(name : string){
        const command = new DeleteInstanceCommand({
            instanceName:name,
            forceDeleteAddOns: true
        })

        await this.client.send(command)
    }
    async DeleteDisk(name : string){
        const command = new DeleteDiskCommand({
            diskName:name,
            forceDeleteAddOns:true
        })

        await this.client.send(command)
    }
}