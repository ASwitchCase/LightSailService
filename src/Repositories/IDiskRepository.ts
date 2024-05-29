import { DiskModel } from "../Models/DiskModel";

export interface IDiskRepository {
    getDisk(id : string) : Promise<DiskModel>
    getAllDisks() : Promise<DiskModel[]>
    addDisk(disk : DiskModel) : Promise<DiskModel>
    deleteDisk(id : string) : Promise<void>
}