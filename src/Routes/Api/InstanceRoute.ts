import { LSInstanceController } from '../../Controllers/LSInstanceController'
import { Controllers } from '../../Utils/Tools'
import { RouteBuilder } from '../../Utils/RouteBuilder'
import { LightSailContorller } from '../../Controllers/LightSailController'
import { verifyToken } from '../../Middleware/Auth'

const instanceController : LSInstanceController = Controllers.DynamoDbInstanceController
const lsController : LightSailContorller = Controllers.LSContorller

export function mapInstanceRoutes(builder: RouteBuilder) : RouteBuilder {
    builder.router.post('/instances',verifyToken, async (req,res) => await lsController.CreateInstance(req,res))
    builder.router.get('/instances',verifyToken,async (req,res) => await instanceController.GetAll(req,res))
    builder.router.get('/instances/:id',verifyToken,async (req,res) => await instanceController.GetOne(req,res))
    return builder
}