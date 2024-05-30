import { LSInstanceController } from '../../Controllers/LSInstanceController'
import { Controllers } from '../../Utils/Tools'
import { RouteBuilder } from '../../Utils/RouteBuilder'

const instanceController : LSInstanceController = Controllers.DynamoDbInstanceController

export function mapInstanceRoutes(builder: RouteBuilder) : RouteBuilder {
    builder.router.get('/instances',async (req,res) => await instanceController.GetAll(req,res))
    builder.router.get('/instances/:id',async (req,res) => await instanceController.GetOne(req,res))

    return builder
}