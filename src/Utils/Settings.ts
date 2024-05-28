import { UserAccountModel } from "../Models/UserAccountModel"

export const SETTINGS ={
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