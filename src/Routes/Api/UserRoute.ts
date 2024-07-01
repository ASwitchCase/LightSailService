import { UserController } from '../../Controllers/UserController'
import { Controllers } from '../../Utils/Tools'
import { RouteBuilder } from '../../Utils/RouteBuilder'
import { verifyToken } from '../../Middleware/Auth'

const userController : UserController = Controllers.DynamoDbUserController

export function mapUserRoutes(builder: RouteBuilder) : RouteBuilder {
    builder.router.get('/users',verifyToken,async (req,res) => await userController.GetAll(req,res))
    builder.router.get('/users/:id',verifyToken,async (req,res) => await userController.GetOne(req,res))

    return builder
}