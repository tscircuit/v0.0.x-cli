import { createFetchHandlerFromDir } from "winterspec/adapters/node"
import { Request as EdgeRuntimeRequest } from "@edge-runtime/primitives"

const serverFetch = await createFetchHandlerFromDir("./routes")

console.log("starting dev-server-api on localhost:3021")
Bun.serve({
  fetch: (bunReq) => {
    const req = new EdgeRuntimeRequest(bunReq.url, {
      headers: bunReq.headers,
      method: bunReq.method,
      body: bunReq.body,
    })
    return serverFetch(req as any)
  },
  port: 3021,
})
