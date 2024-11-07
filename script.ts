import { LightsailClient } from "@aws-sdk/client-lightsail";
import { LightSailService } from "./src/Services/LightSailService";
import { DiskModel } from "./src/Models/DiskModel";
import { InstanceModel } from "./src/Models/InstanceModel";
import { uuidv4 } from "./src/Utils/MyGuid";
import { LSInstanceDynamoRepository } from "./src/Repositories/LSInstanceDynamoRepository";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { UserAccountDynamoRepository } from "./src/Repositories/UserAccountDynamoRepository";
import { DiskDynamoRepository } from "./src/Repositories/DiskDynamoRepository";
import { UserAccountModel } from "./src/Models/UserAccountModel";
import { SETTINGS } from "./src/Utils/Tools";

(async () => {
    let lsService : LightSailService = new LightSailService(new LightsailClient({region:"us-east-2"}))
    let instanceRepo : LSInstanceDynamoRepository = new LSInstanceDynamoRepository(new DynamoDB({region:"us-east-1"}))
    let userRepo : UserAccountDynamoRepository = new UserAccountDynamoRepository(new DynamoDB({region:"us-east-1"}))
    let diskRepo : DiskDynamoRepository = new DiskDynamoRepository(new DynamoDB({region:"us-east-1"}))

    console.log("Loading Config...")
    const config : any = require('./lsconfig.json')

    config.new_users.forEach( async (user: any) => {
        const new_instance : InstanceModel = {
            id:uuidv4(),
            name:`${user}-${SETTINGS.courseName}`,
            ...config.instance
        }
        const new_disk : DiskModel ={
            id:uuidv4(),
            name:`${user}-${SETTINGS.courseName}-data`,
            ...config.disk
        }
        const new_user : UserAccountModel ={
            id: uuidv4(),
            username: `BIOL-${new_instance.name}`,
            assigned_instance: new_instance.id,
            assigned_disk: new_disk.id
        }
        
    
        await lsService.createDiskAndWait(new_disk)
        await lsService.createInstanceAndWait(new_instance)
        await lsService.attachDisk(new_disk.name,new_instance.name,SETTINGS.dataDiskPath)

        await instanceRepo.addInstance(new_instance)
        await diskRepo.addDisk(new_disk)
        await userRepo.addUser(new_user)

        console.log(`Process for ${user} completed!`)
    });
    
}
)();
