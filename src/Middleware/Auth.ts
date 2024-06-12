const {Request : Req, Response: Res, NextFunction : NextFunction} = require('express')
const jwt = require('njwt')

export function verifyToken(req : typeof Req,res : typeof Res,next : typeof NextFunction) {
    const bearerHeader = req.headers['authorization'];

    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        const token = bearerToken;
        jwt.verify(token,'top-secret-phrase',(err:any,vjwt:any) =>{
            if(err){
                res.sendStatus(403)
                console.log(err)
            }else{
                next();
            }
            
        })
       
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}
export function createJWT(req : typeof Req,res : typeof Res){
    const jwt = require('njwt')
    const claims = { createdAt:String(new Date()), sub: 'flyLightSial' }
    const token = jwt.create(claims, 'top-secret-phrase')
    token.setExpiration(new Date().getTime() + 60*1000)
    res.send(token.compact())
}
