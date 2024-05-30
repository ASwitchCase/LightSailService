import express, { Router } from 'express'
import { UserController } from '../../Controllers/UserController'
import { DiskController } from '../../Controllers/DiskController'
import { LSInstanceController } from '../../Controllers/LSInstanceController'

export class RouteBuilder {
    // Add New contorllers here
    constructor(
        private userController : UserController,
        private diskController : DiskController,
        private instanceController : LSInstanceController,
    ){}

    mapUserRoutes() : Router {
        var router = express.Router()
        router.get('/',async (req,res) => await this.userController.GetAll(req,res))
        router.get('/:id',async (req,res) => await this.userController.GetOne(req,res))

        return router
    }

    mapDiskRoutes() : Router {
        var router = express.Router()
        router.get('/',async (req,res) => await this.diskController.GetAll(req,res))
        router.get('/:id',async (req,res) => await this.diskController.GetOne(req,res))

        return router
    }

    mapInstanceRoutes() : Router {
        var router = express.Router()
        router.get('/',async (req,res) => await this.instanceController.GetAll(req,res))
        router.get('/:id',async (req,res) => await this.instanceController.GetOne(req,res))

        return router
    }
}