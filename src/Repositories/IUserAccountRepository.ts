import { UserAccountModel } from "../Models/UserAccountModel"

export interface IUserAccountRepository {
    getUser(id : string) :  Promise<UserAccountModel>
    getAllUsers() : Promise<UserAccountModel[]>
    updateUser(id: string, user : UserAccountModel) : Promise<UserAccountModel>
    addUser(user: UserAccountModel) : Promise<UserAccountModel>
    deleteUser(id : string) : Promise<void>
}
