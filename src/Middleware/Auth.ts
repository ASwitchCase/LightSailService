import { DynamoDB } from "@aws-sdk/client-dynamodb";

const {Request : Req, Response: Res, NextFunction : NextFunction} = require('express')
const jwt = require('njwt')

export async function verifyToken(req : typeof Req,res : typeof Res,next : typeof NextFunction) {
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
export async function createJWT(req : typeof Req,res : typeof Res){
    const jwt = require('njwt')
    const claims = { createdAt:String(new Date()), sub: 'flyLightSial' }
    const token = jwt.create(claims, 'top-secret-phrase')
    token.setExpiration(new Date().getTime() + 86400*1000)

    await verifyAdminUser(req.body.username,req.body.password)

    res.send(token.compact())
}

async function verifyAdminUser(username: string, password : string) : Promise<boolean>{
    const db = new DynamoDB({region:'us-east-1'})
    let res : any[] = []
    var scan = await db.scan({
        TableName: 'lightsail-lab-admins'
    })

    // Get Admin Users
    scan.Items?.forEach(item =>{
        res.push({
            id : item?.id.S!,
            username : item?.username.S!,
            password : item?.password.S!
        })
    })

    // Check if username and password match any user
    res.forEach(item => {
        if(item.username === username && item.password === password) return true
    })

    return false
}
