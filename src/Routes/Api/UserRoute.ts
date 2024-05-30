import express, { Router } from 'express'
import { UserController } from '../../Controllers/UserController'
import { DiskController } from '../../Controllers/DiskController'
import { LSInstanceController } from '../../Controllers/LSInstanceController'
import { Controllers } from '../../Utils/Tools'

const userController : UserController = Controllers.DynamoDbUserController

export function mapUserRoutes() : Router {
    var router = express.Router()
    router.get('/',async (req,res) => await userController.GetAll(req,res))
    router.get('/:id',async (req,res) => await userController.GetOne(req,res))

    return router
}