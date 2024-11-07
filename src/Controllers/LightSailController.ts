import { NextFunction } from "express";
import { DiskModel } from "../Models/DiskModel";
import { InstanceModel } from "../Models/InstanceModel";
import { UserAccountModel } from "../Models/UserAccountModel";
import { IDiskRepository } from "../Repositories/IDiskRepository";
import { ILSInstanceRepository } from "../Repositories/ILSInstanceRepository";
import { IUserAccountRepository } from "../Repositories/IUserAccountRepository";
import { LightSailService } from "../Services/LightSailService";
import { uuidv4 } from "../Utils/MyGuid";
import { sleep } from "../Utils/Sleep";
import { SETTINGS } from "../Utils/Tools";
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
            ...req.body.instance,
            name:`${req.body.instance.name}-${SETTINGS.courseName}`
        }
        const new_disk : DiskModel ={
            id:uuidv4(),
            name:`${req.body.instance.name}-${SETTINGS.courseName}-data`,
            ...req.body.disk
        }
        const new_user : UserAccountModel ={
            id: uuidv4(),
            username: `BIOL-${new_instance.name}`,
            assigned_instance: new_instance.id,
            assigned_disk: new_disk.id
        }
        
        // Create Resources
        await this.lsService.createDiskAndWait(new_disk)
        await this.lsService.createInstanceAndWait(new_instance)
        await this.lsService.attachDisk(new_disk.name,new_instance.name,SETTINGS.dataDiskPath)
            
        // Update Information
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
        const instances = await this.instanceRepo.getAllInstances()
        const users = await this.userRepo.getAllUsers()
        
        instances.forEach(async (instance) =>{
            if(instance.id === req.params.id){
                await this.lsService.DeleteInstance(instance.name)
                await this.instanceRepo.deleteInstance(instance.id)
                users.forEach(async (user) =>{
                    if(user.assigned_instance === instance.id){
                        user.assigned_instance = ""
                        await this.userRepo.updateUser(user.id,user)
                    }
                })
            }
        })
        res.send("Disk Deleted")
        
    }

    async AttachCourseMaterialsDisk(req : typeof Req, res : typeof Res){
        let results : any[] = []

        req.body.target_users.forEach(async (user:any) => {
            const new_disk : DiskModel ={
                id:uuidv4(),
                name:`${user}-${SETTINGS.courseName}-course-materials`,
                ...req.body.disk
            }

            await this.lsService.createDiskFromSnapshotAndWait(req.body.snapshot_name,new_disk)
            await this.lsService.attachDisk(new_disk.name,`${user}-${SETTINGS.courseName}`,SETTINGS.courseMaterialsDiskPath)

            results.push(new_disk)
        })
        res.send({
            results
        })
    }

    async CreateInstancesFromSnap(req : typeof Req, res : typeof Res){
        let results : any[] = []

        req.body.new_users.forEach( async (user: any) => {
            const new_instance : InstanceModel = {
                id:uuidv4(),
                name:`${user}-${SETTINGS.courseName}`,
                ...req.body.instance
            }
            
            await this.lsService.createInstanceFromSnapshotAndWait(req.body.snapshot_name,{name:new_instance.name,zone:new_instance.zone,bundle_id:new_instance.bundle_id})
    
            console.log(`Process for ${user} completed!`)
            results.push({
                new_instance
            })
        });

        res.send({
            results
        })
    }

    async CreateManyInstances(req : typeof Req, res : typeof Res){
        let results : any[] = []
        req.body.new_users.forEach( async (user: any) => {
            const new_instance : InstanceModel = {
                id:uuidv4(),
                name:`${user}-${SETTINGS.courseName}`,
                ...req.body.instance
            }
            const new_disk : DiskModel ={
                id:uuidv4(),
                name:`${user}-${SETTINGS.courseName}-data`,
                ...req.body.disk
            }
            const new_user : UserAccountModel ={
                id: uuidv4(),
                username: `BIOL-${new_instance.name}`,
                assigned_instance: new_instance.id,
                assigned_disk: new_disk.id
            }
            
        
            await this.lsService.createDiskAndWait(new_disk)
            await this.lsService.createInstanceAndWait(new_instance)
            await this.lsService.attachDisk(new_disk.name,new_instance.name,SETTINGS.dataDiskPath)
    
            await this.instanceRepo.addInstance(new_instance)
            await this.diskRepo.addDisk(new_disk)
            await this.userRepo.addUser(new_user)
    
            console.log(`Process for ${user} completed!`)
            results.push({
                new_instance,
                new_disk,
                new_user
            })
        });
        res.send(results)
    }

    async DeleteDisk(req : typeof Req, res : typeof Res){
        const disks = await this.diskRepo.getAllDisks()
        const users = await this.userRepo.getAllUsers()

        disks.forEach(async (disk) =>{
            if(disk.id === req.params.id){
                await this.lsService.DeleteDisk(disk.name)
                await this.diskRepo.deleteDisk(disk.id)
                users.forEach(async (user) =>{
                    if(user.assigned_disk === disk.id){
                        user.assigned_disk = ""
                        await this.userRepo.updateUser(user.id,user)
                    }
                })
            }
        })
        res.send("Instance Deleted")

    }
    
}