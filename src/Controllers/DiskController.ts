import { DiskModel } from "../Models/DiskModel";
import { IDiskRepository } from "../Repositories/IDiskRepository";
const {Request : Req, Response: Res} = require('express')

export class DiskController{
    constructor(private repo : IDiskRepository){}
    async GetOne(req : typeof Req, res : typeof Res) : Promise<void>{
        res.json( await this.repo.getDisk(req.params.id))
    }

    async GetAll(req : typeof Req, res : typeof Res) : Promise<void>{
        res.json( await this.repo.getAllDisks())
    }
}