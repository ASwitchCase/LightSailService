import { InstanceModel } from "../Models/InstanceModel";
import { ILSInstanceRepository } from "../Repositories/ILSInstanceRepository";

export class LSInstanceController {
    constructor(private repo : ILSInstanceRepository){}
    async GetOne(id : string) : Promise<InstanceModel>{
        return await this.repo.getInstance(id)
    }

    async GetAll() : Promise<InstanceModel[]>{
        return await this.repo.getAllInstances()
    }
}