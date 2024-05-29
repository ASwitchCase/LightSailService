import { InstanceModel } from "../Models/InstanceModel";

export interface ILSInstanceRepository {
    getInstance(id : string) : Promise<InstanceModel>
    getAllInstances() : Promise<InstanceModel[]>
    addInstance(instance : InstanceModel) : Promise<InstanceModel> 
    deleteInstance(id : string) : Promise<void>
}