import { DiskController } from '../../Controllers/DiskController'
import { Controllers } from '../../Utils/Tools'
import { RouteBuilder } from '../../Utils/RouteBuilder'

const diskController : DiskController = Controllers.DynamoDbDiskController

export function mapDiskRoutes(builder: RouteBuilder) : RouteBuilder {
    builder.router.get('/disks',async (req,res) => await diskController.GetAll(req,res))
    builder.router.get('/disks/:id',async (req,res) => await diskController.GetOne(req,res))

    return builder
}