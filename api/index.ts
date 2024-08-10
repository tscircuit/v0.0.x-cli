import { createWinterSpecFromRouteMap } from "winterspec/adapters/node"
import staticRoutes from "./static-routes"

export default await createWinterSpecFromRouteMap(staticRoutes)
