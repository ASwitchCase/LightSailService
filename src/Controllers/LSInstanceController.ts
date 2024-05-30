import { InstanceModel } from "../Models/InstanceModel";
import { ILSInstanceRepository } from "../Repositories/ILSInstanceRepository";
const {Request : Req, Response: Res} = require('express')

export class LSInstanceController {
    constructor(private repo : ILSInstanceRepository){}
    async GetOne(req : typeof Req, res : typeof Res) : Promise<void>{
        res.json( await this.repo.getInstance(req.params.id))
    }

    async GetAll(req : typeof Req, res : typeof Res) : Promise<void>{
        res.json( await this.repo.getAllInstances())
    }
}