import { UserAccountModel } from "../Models/UserAccountModel";
import { IUserAccountRepository } from "../Repositories/IUserAccountRepository";

export class UserController {
    constructor(private repo : IUserAccountRepository){}

    async GetOne(id : string) : Promise<UserAccountModel>{
        return await this.repo.getUser(id)
    }

    async GetAll() : Promise<UserAccountModel[]>{
        return await this.repo.getAllUsers()
    }

    test(){
        return {
            msg:'hello'
        }
    }
}