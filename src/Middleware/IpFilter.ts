const {Request : Req, Response: Res, NextFunction : NextFunction} = require('express')

export function ipFilter(req : typeof Req, res : typeof Res, next : typeof NextFunction){
    const whiteList = ['34.197.169.124']

    if(whiteList.includes(req.connection.remoteAddress)){
        next()
    } else {
        res.sendStatus(403)
    } 
}