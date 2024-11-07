import { DynamoDB } from "@aws-sdk/client-dynamodb"
import { UserController } from "../Controllers/UserController"
import { UserAccountDynamoRepository } from "../Repositories/UserAccountDynamoRepository"
import { DiskController } from "../Controllers/DiskController"
import { DiskDynamoRepository } from "../Repositories/DiskDynamoRepository"
import { LSInstanceController } from "../Controllers/LSInstanceController"
import { LSInstanceDynamoRepository } from "../Repositories/LSInstanceDynamoRepository"
import { AddOnRequest, LightsailClient, Tag } from "@aws-sdk/client-lightsail"
import { LightSailContorller } from "../Controllers/LightSailController"
import { LightSailService } from "../Services/LightSailService"

const AutoSnapshot : AddOnRequest = {
            addOnType: "AutoSnapshot",
            autoSnapshotAddOnRequest: {
                snapshotTimeOfDay: "05:00"
            }
        }

const CostContorlRules : AddOnRequest = {
    addOnType: "StopInstanceOnIdle",
    stopInstanceOnIdleRequest: {
        duration: "15",
        threshold: "10"
    }
}

export const SETTINGS = {
    AddOns : {
        autoSnapShot : AutoSnapshot,
        costControlRules : CostContorlRules
    },
    courseName:"BIOL7112NA-202410",
    dataDiskPath:"/dev/xvdf",
    courseMaterialsDiskPath:"/dev/xvdg",

    GetInstanceTags(username: string) : Tag[]{
        return [
            {key:'Name', value:`${username}`},
            {key:'shu:username', value:username},
            {key:'Name', value:username}
        ]
    },
}

export const Controllers = {
    DynamoDbUserController : new UserController(
        new UserAccountDynamoRepository(
            new DynamoDB({region:"us-east-1"})
        )
    ),
    DynamoDbDiskController : new DiskController(
        new DiskDynamoRepository(
            new DynamoDB({region:"us-east-1"})
        )
    ),
    DynamoDbInstanceController : new LSInstanceController(
        new LSInstanceDynamoRepository(
            new  DynamoDB({region:"us-east-1"})
        )
    ),
    LSContorller : new LightSailContorller(
        new UserAccountDynamoRepository(new DynamoDB({region:"us-east-1"})),
                                        new DiskDynamoRepository(new DynamoDB({region:"us-east-1"})),
                                        new LSInstanceDynamoRepository(new DynamoDB({region:"us-east-1"})),
                                        new LightSailService(new LightsailClient({region:"us-east-2"})))
}
