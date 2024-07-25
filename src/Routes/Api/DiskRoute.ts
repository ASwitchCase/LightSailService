import { DiskController } from '../../Controllers/DiskController'
import { Controllers } from '../../Utils/Tools'
import { RouteBuilder } from '../../Utils/RouteBuilder'
import { verifyToken } from '../../Middleware/Auth'
import { LightSailContorller } from '../../Controllers/LightSailController'

const diskController : DiskController = Controllers.DynamoDbDiskController
const lsController : LightSailContorller = Controllers.LSContorller

export function mapDiskRoutes(builder: RouteBuilder) : RouteBuilder {
    builder.router.get('/disks',verifyToken,async (req,res) => await diskController.GetAll(req,res))
    builder.router.get('/disks/:id',verifyToken,async (req,res) => await diskController.GetOne(req,res))
    builder.router.delete('/disks/:id',verifyToken,async (req,res) => await lsController.DeleteDisk(req,res))

    return builder
}