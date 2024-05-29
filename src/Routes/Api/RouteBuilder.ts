import express, { Router } from 'express'
import { UserController } from '../../Controllers/UserController'
import { DiskController } from '../../Controllers/DiskController'

export class RouteBuilder {
    // Add New contorllers here
    constructor(
        private userController : UserController,
        private diskController : DiskController
    ){}

    mapUserRoutes() : Router {
        var router = express.Router()

        router.get('/',async (req,res) =>{
            res.send(await this.userController.GetAll())
        })

        router.get('/:id',async (req,res) =>{
            res.send(await this.userController.GetOne(req.params.id))
        })

        return router
    }

    mapDiskRoutes() : Router {
        var router = express.Router()

        router.get('/',async (req,res) =>{
            res.send(await this.diskController.GetAll())
        })

        router.get('/:id',async (req,res) =>{
            res.send(await this.diskController.GetOne(req.params.id))
        })

        return router
    }
}