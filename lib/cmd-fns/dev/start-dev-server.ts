import { AxiosInstance } from "axios"
import { devServerRequestHandler } from "./dev-server-request-handler"

export const startDevServer = async ({
  port,
  devServerAxios,
}: {
  port: number
  devServerAxios: AxiosInstance
}) => {
  let server: any
  if (typeof Bun !== "undefined") {
    server = Bun.serve({
      fetch: devServerRequestHandler,
      development: false,
      port,
    })
  } else {
    // Hono messes up the globals, only import it if we don't have Bun
    const { Hono } = await import("hono")
    const { serve } = await import("@hono/node-server")
    const honoApp = new Hono()
    honoApp.all("/*", (c) => devServerRequestHandler(c.req.raw))
    server = serve({
      fetch: honoApp.fetch,
      port,
    })
  }

  console.log("Running health check against dev server...")
  await devServerAxios.get("/api/health")

  return server
}
