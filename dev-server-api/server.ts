import { createFetchHandlerFromDir } from "winterspec/adapters/node"

const serverFetch = await createFetchHandlerFromDir("./routes")

console.log("starting dev-server-api on localhost:3021")
Bun.serve({
  fetch: (req) => serverFetch(req),
  port: 3021,
})
