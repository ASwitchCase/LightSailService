import { DiskModel } from "../Models/DiskModel";
import { InstanceModel } from "../Models/InstanceModel";
import { UserAccountModel } from "../Models/UserAccountModel";
import { IDiskRepository } from "../Repositories/IDiskRepository";
import { ILSInstanceRepository } from "../Repositories/ILSInstanceRepository";
import { IUserAccountRepository } from "../Repositories/IUserAccountRepository";
import { LightSailService } from "../Services/LightSailService";
import { uuidv4 } from "../Utils/MyGuid";
import { sleep } from "../Utils/Sleep";
const {Request : Req, Response: Res} = require('express')

export class LightSailContorller {
    constructor(
        private userRepo : IUserAccountRepository,
        private diskRepo : IDiskRepository,
        private instanceRepo : ILSInstanceRepository,
        private lsService : LightSailService
    ){}

    async CreateInstance(req : typeof Req, res : typeof Res){
        const new_instance : InstanceModel = {
            id:uuidv4(),
            ...req.body.instance
        }
        const new_disk : DiskModel ={
            id:uuidv4(),
            name:`${new_instance.name}-disk`,
            ...req.body.disk
        }
        const new_user : UserAccountModel ={
            id: uuidv4(),
            username: `BIOL-${new_instance.name}`,
            assigned_instance: new_instance.id,
            assigned_disk: new_disk.id
        }

        // Create Resources
        await this.lsService.createDisk(new_disk)
        await this.lsService.createInstanceAndWait(new_instance)
        await this.lsService.attachDisk(new_disk.name,new_instance.name)
        
        // Store Information
        await this.instanceRepo.addInstance(new_instance)
        await this.diskRepo.addDisk(new_disk)
        await this.userRepo.addUser(new_user)
        

        res.send({
            new_instance,
            new_disk,
            new_user
        })
    }

    async DeleteInstance(req : typeof Req, res : typeof Res){
        throw new Error("Not Implemented")
    }
    
}