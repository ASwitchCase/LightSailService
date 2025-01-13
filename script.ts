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
   
    console.log("Loading Config...")
    let config : any = require('../lsconfig.json')

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
    
        await lsService.createDiskAndWait(new_disk)
        await lsService.createInstanceFromSnapshotAndWait(config.snapshot_name,new_instance)
        await lsService.attachDisk(new_disk.name,new_instance.name,SETTINGS.dataDiskPath)

     

        console.log(`Process for ${user} completed!`)
    });
    
}
)();
