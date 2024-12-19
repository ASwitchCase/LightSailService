import { LSInstanceController } from '../../Controllers/LSInstanceController'
import { Controllers } from '../../Utils/Tools'
import { RouteBuilder } from '../../Utils/RouteBuilder'
import { LightSailContorller } from '../../Controllers/LightSailController'
import { verifyToken } from '../../Middleware/Auth'

const instanceController : LSInstanceController = Controllers.DynamoDbInstanceController
const lsController : LightSailContorller = Controllers.LSContorller

export function mapServiceRequestRoutes(builder: RouteBuilder) : RouteBuilder {
    builder.router.post('/service-requests', verifyToken,async (req,res) => {
        if(req.body.request_type === 'CREATE_INSTANCE'){
            await lsController.CreateInstance(req,res)
        }
        else if(req.body.request_type === 'DELETE_INSTANCE'){
            await lsController.DeleteInstance(req,res)
        }
        else if(req.body.request_type === 'CREATE_MANY_INSTANCES'){
            await lsController.CreateManyInstances(req,res)
        }
        else if(req.body.request_type === 'CREATE_MANY_INSTANCES_FROM_SNAP'){
            await lsController.CreateInstancesFromSnap(req,res)
        }
        else if(req.body.request_type === 'ATTACH_COURSE_MATERIALS_DISK'){
            await lsController.AttachCourseMaterialsDisk(req,res)
        }
    })
    return builder
}