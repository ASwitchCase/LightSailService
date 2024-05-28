import { DynamoDB } from "@aws-sdk/client-dynamodb"
import { UserController } from "../Controllers/UserController"
import { UserAccountModel } from "../Models/UserAccountModel"
import { UserAccountDynamoRepository } from "../Repositories/UserAccountDynamoRepository"

export const SETTINGS = {
    AddOns : {
        AutoSnapshot: 
            {
                addOnType: "AutoSnapshot",
                autoSnapshotAddOnRequest: {
                    snapshotTimeOfDay: "05:00"
                }
            }
        ,
        CostContorlRules: {
            addOnType: "StopInstanceOnIdle",
            stopInstanceOnIdleRequest: {
                duration: "20",
                threshold: "5"
            }
        }
    },

    GetInstanceTags : (username: string, course_name : string)=>{
        return [
            {Key:'Name', Value:`${course_name}-${username}`},
            {Key:'shu:username', Value:username},
            {Key:'Name', Value:username}
        ]
    },
}

export const Controllers = {
    DynamoDbUserController : new UserController(new UserAccountDynamoRepository(new DynamoDB({region:"us-east-1"}),"test_table"))
}
