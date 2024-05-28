import express, { Router } from 'express'
import { UserController } from '../../Controllers/UserController'

export class UserRouteBuilder {
    constructor(private userController : UserController){}
    mapUserRoutes() : Router{
        var router = express.Router()

        router.get('/',async (req,res) =>{
            res.send(await this.userController.GetAll())
        })

        router.get('/:id',async (req,res) =>{
            res.send(await this.userController.GetOne(req.params.id))
        })

        return router
    }
}