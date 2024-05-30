import express from 'express'
import { RouteBuilder } from "./src/Routes/Api/RouteBuilder";
import { Controllers } from "./src/Utils/Tools";
import { UserAccountDynamoRepository } from './src/Repositories/UserAccountDynamoRepository';
import { DynamoDB } from '@aws-sdk/client-dynamodb';


const app = express()
app.use(express.json())

// Build api endpoints
const builder = new RouteBuilder(
    Controllers.DynamoDbUserController,
    Controllers.DynamoDbDiskController,
    Controllers.DynamoDbInstanceController
)

// Initalize routes
app.use('/users',builder.mapUserRoutes())
app.use('/disks',builder.mapDiskRoutes())
app.use('/instances',builder.mapInstanceRoutes())

const r = new UserAccountDynamoRepository(new DynamoDB({region:"us-east-1"}))

app.get('/',(req,res) =>{
    res.send(r.addUser({
        id: 'fgsfdgsdfgs',
        username: 'test',
        assigned_instance: 'sfsdfgzf',
        assigned_disk: 'sdfsfsfdf'
    }))
})

// Start Server
app.listen(3000,() =>{
    console.log('listening...')
})
