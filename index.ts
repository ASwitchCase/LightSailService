import express from 'express'
import { RouteBuilder } from "./src/Utils/RouteBuilder";
import { mapUserRoutes } from './src/Routes/Api/UserRoute';
import { mapDiskRoutes } from './src/Routes/Api/DiskRoute';
import { mapInstanceRoutes } from './src/Routes/Api/InstanceRoute';
import { mapAuthRoutes } from './src/Routes/Api/AuthRoute';
import { ipFilter } from './src/Middleware/IpFilter';
import { ErrorHandler } from './src/Middleware/ErrorHandler';
import { mapServiceRequestRoutes } from './src/Routes/Api/ServiceRequestRoute';
const serverless = require("serverless-http")
const app = express()

app.use(express.json())
//app.use(ipFilter)

// Build api endpoints
const builder = new RouteBuilder()
    .AddRoute((b) => mapDiskRoutes(b))
    .AddRoute((b) => mapUserRoutes(b))
    .AddRoute((b) => mapInstanceRoutes(b))
    .AddRoute((b) => mapAuthRoutes(b))
    .AddRoute((b) => mapServiceRequestRoutes(b))

// Initailize routes
app.use('/',builder.router)

// Start Server TEST
app.listen(3000,() =>{
    console.log('listening...')
})

//app.use(ErrorHandler)

//module.exports.handler = serverless(app)

