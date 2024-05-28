import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { UserAccountDynamoRepository } from "./src/Repositories/UserAccountDynamoRepository";

import express from 'express'
import { UserController } from "./src/Controllers/UserController";
import { UserRouteBuilder } from "./src/Routes/Api/UserRouteEndpoints";

const app = express()

const users  = new UserRouteBuilder(
    new UserController(
        new UserAccountDynamoRepository(
            new DynamoDB({region:"us-east-1"}),"test_table")
        )
    )

app.use('/users',users.mapUserRoutes())

app.listen(3000,() =>{
    console.log('listening...')
})
