import { DiskController } from '../../Controllers/DiskController'
import { Controllers } from '../../Utils/Tools'
import { RouteBuilder } from '../../Utils/RouteBuilder'
import { verifyToken } from '../../Middleware/Auth'

const diskController : DiskController = Controllers.DynamoDbDiskController

export function mapDiskRoutes(builder: RouteBuilder) : RouteBuilder {
    builder.router.get('/disks',verifyToken,async (req,res) => await diskController.GetAll(req,res))
    builder.router.get('/disks/:id',verifyToken,async (req,res) => await diskController.GetOne(req,res))

    return builder
}