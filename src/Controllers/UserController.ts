import { IUserAccountRepository } from "../Repositories/IUserAccountRepository";
const {Request : Req, Response: Res} = require('express')

export class UserController {
    constructor(private repo : IUserAccountRepository){}

    async GetOne(req : typeof Req, res : typeof Res) : Promise<void>{
        res.json( await this.repo.getUser(req.params.id))
    }

    async GetAll(req : typeof Req, res : typeof Res) : Promise<void>{
        res.json( await this.repo.getAllUsers())
    }

}