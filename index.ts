import express from 'express'
import { RouteBuilder } from "./src/Utils/RouteBuilder";
import { mapUserRoutes } from './src/Routes/Api/UserRoute';
import { mapDiskRoutes } from './src/Routes/Api/DiskRoute';
import { mapInstanceRoutes } from './src/Routes/Api/InstanceRoute';


const app = express()
app.use(express.json())

// Build api endpoints
const builder = new RouteBuilder()
    .AddRoute((b) => mapUserRoutes(b))
    .AddRoute((b) => mapDiskRoutes(b))
    .AddRoute((b) => mapInstanceRoutes(b))

// Initalize routes
app.use('/',builder.router)

// Start Server
app.listen(3000,() =>{
    console.log('listening...')
})
