import { LightSailContorller } from "../../Controllers/LightSailController";
import { RouteBuilder } from "../../Utils/RouteBuilder";
import { Controllers } from "../../Utils/Tools";

const lsController : LightSailContorller = Controllers.LSContorller

export function mapCommandRoutes(builder : RouteBuilder) : RouteBuilder {
    builder.router.post('/commands/CreateInstance', async (req,res) => lsController.CreateInstance(req,res))
    return builder
}