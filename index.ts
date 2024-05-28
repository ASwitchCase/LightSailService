import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { UserAccountDynamoRepository } from "./src/Repositories/UserAccountDynamoRepository";

import express from 'express'
import { UserController } from "./src/Controllers/UserController";
import { RouteBuilder } from "./src/Routes/Api/RouteBuilder";
import { Controllers } from "./src/Utils/Tools";

const app = express()

const builder  = new RouteBuilder(Controllers.DynamoDbUserController)

app.use('/users',builder.mapUserRoutes())

app.listen(3000,() =>{
    console.log('listening...')
})
