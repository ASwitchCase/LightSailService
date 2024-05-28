import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { UserAccountDynamoRepository } from "./src/Repositories/UserAccountDynamoRepository";
import { uuidv4 } from "./src/Utils/MyGuid";

import express from 'express'

const app = express()


let repo = new UserAccountDynamoRepository(new DynamoDB({region:"us-east-1"}),"test_table")

app.listen(3000,() =>{
    console.log('listening...')
})
