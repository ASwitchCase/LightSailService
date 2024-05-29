import { DiskModel } from "../Models/DiskModel";
import { IDiskRepository } from "../Repositories/IDiskRepository";

export class DiskController{
    constructor(private repo : IDiskRepository){}

    async GetOne(id : string) : Promise<DiskModel>{
        return await this.repo.getDisk(id)
    }

    async GetAll() : Promise<DiskModel[]>{
        return await this.repo.getAllDisks()
    }
}