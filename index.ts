import express from 'express'
import { RouteBuilder } from "./src/Routes/Api/RouteBuilder";
import { Controllers } from "./src/Utils/Tools";


const app = express()

// Build api endpoints
const builder = new RouteBuilder(
    Controllers.DynamoDbUserController,
    Controllers.DynamoDbDiskController
)

// Initalize routes
app.use('/users',builder.mapUserRoutes())
app.use('/disks',builder.mapDiskRoutes())

// Start Server
app.listen(3000,() =>{
    console.log('listening...')
})
