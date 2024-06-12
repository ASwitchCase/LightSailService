import express, { Router } from 'express'

interface Func<T,TResult>
{
    (item : T) : TResult
}

export class RouteBuilder {
    public router : Router
    constructor(){
        this.router = express.Router()
    }
    
    AddRoute(routeAdjuster:Func<RouteBuilder,RouteBuilder>){
        return routeAdjuster(this)
    }
}