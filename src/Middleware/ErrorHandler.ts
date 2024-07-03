const {Request : Req, Response: Res, NextFunction : NextFunction} = require('express')

export function ErrorHandler(err: any, req: any, res: any, next: any){
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong';
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    })
}