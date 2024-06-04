import express from 'express'
import { RouteBuilder } from "./src/Utils/RouteBuilder";
import { mapUserRoutes } from './src/Routes/Api/UserRoute';
import { mapDiskRoutes } from './src/Routes/Api/DiskRoute';
import { mapInstanceRoutes } from './src/Routes/Api/InstanceRoute';
import { LightSailContorller } from './src/Controllers/LightSailController';
import { DiskDynamoRepository } from './src/Repositories/DiskDynamoRepository';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { UserAccountDynamoRepository } from './src/Repositories/UserAccountDynamoRepository';
import { LSInstanceDynamoRepository } from './src/Repositories/LSInstanceDynamoRepository';
import { LightSailService } from './src/Services/LightSailService';
import { LightsailClient } from '@aws-sdk/client-lightsail';
import { mapCommandRoutes } from './src/Routes/Api/CommandRoutes';


const app = express()
app.use(express.json())

// Testing
const db = new DynamoDB({region:"us-east-1"})
const ls = new LightSailContorller(new UserAccountDynamoRepository(db),new DiskDynamoRepository(db),new LSInstanceDynamoRepository(db),new LightSailService(new LightsailClient({region:"us-east-2"})))
app.post('/test',async (res,req) => await ls.CreateInstance(res,req))

// Build api endpoints
const builder = new RouteBuilder()
    .AddRoute((b) => mapUserRoutes(b))
    .AddRoute((b) => mapDiskRoutes(b))
    .AddRoute((b) => mapInstanceRoutes(b))
    .AddRoute((b) => mapCommandRoutes(b))

// Initailize routes
app.use('/',builder.router)

// Start Server
app.listen(3000,() =>{
    console.log('listening...')
})
