import express from 'express'
import { RouteBuilder } from "./src/Utils/RouteBuilder";
import { mapUserRoutes } from './src/Routes/Api/UserRoute';
import { mapDiskRoutes } from './src/Routes/Api/DiskRoute';
import { mapInstanceRoutes } from './src/Routes/Api/InstanceRoute';
import { verifyToken } from './src/Middleware/Auth';
import { mapAuthRoutes } from './src/Routes/Api/AuthRoute';

const app = express()

app.use(express.json())

// Build api endpoints
const builder = new RouteBuilder()
    .AddRoute((b) => mapDiskRoutes(b))
    .AddRoute((b) => mapUserRoutes(b))
    .AddRoute((b) => mapInstanceRoutes(b))
    .AddRoute((b) => mapAuthRoutes(b))

// Initailize routes
app.use('/',builder.router)

// Start Server
app.listen(3000,() =>{
    console.log('listening...')
})
