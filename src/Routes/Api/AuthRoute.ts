import { createJWT } from "../../Middleware/Auth";
import { RouteBuilder } from "../../Utils/RouteBuilder";

export function mapAuthRoutes(builder : RouteBuilder) : RouteBuilder{
    builder.router.get('/auth/getToken',createJWT)
    return builder
}