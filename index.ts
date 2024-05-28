import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { UserAccountDynamoRepository } from "./src/Repositories/UserAccountDynamoRepository";

import express from 'express'
import { UserController } from "./src/Controllers/UserController";
import { RouteBuilder } from "./src/Routes/Api/RouteBuilder";

const app = express()

const builder  = new RouteBuilder(
    new UserController(
        new UserAccountDynamoRepository(
            new DynamoDB({region:"us-east-1"}),"test_table")
        )
    )

app.use('/users',builder.mapUserRoutes())

app.listen(3000,() =>{
    console.log('listening...')
})
