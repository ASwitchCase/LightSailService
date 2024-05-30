import { UserController } from '../../Controllers/UserController'
import { Controllers } from '../../Utils/Tools'
import { RouteBuilder } from '../../Utils/RouteBuilder'

const userController : UserController = Controllers.DynamoDbUserController

export function mapUserRoutes(builder: RouteBuilder) : RouteBuilder {
    builder.router.get('/users',async (req,res) => await userController.GetAll(req,res))
    builder.router.get('/users/:id',async (req,res) => await userController.GetOne(req,res))

    return builder
}