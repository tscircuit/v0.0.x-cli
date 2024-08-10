import { createFetchHandlerFromDir } from "winterspec/adapters/node"
import { Request as EdgeRuntimeRequest } from "@edge-runtime/primitives"
import type { Middleware } from "winterspec/middleware"
import { join } from "node:path"
import { ZodLevelDatabase } from "api/db/zod-level-db"
import os from "node:os"

export const startServer = async ({ port }: { port: number }) => {
  const db = new ZodLevelDatabase(os.tmpdir() + "/devdb")

  const serverFetch = await createFetchHandlerFromDir(
    join(import.meta.dir, "../../routes"),
    {
      middleware: [
        async (req, ctx, next) => {
          ;(ctx as any).db = db

          return next(req, ctx)
        },
      ],
    },
  )

  return Bun.serve({
    fetch: (bunReq) => {
      const req = new EdgeRuntimeRequest(bunReq.url, {
        headers: bunReq.headers,
        method: bunReq.method,
        body: bunReq.body,
      })
      return serverFetch(req as any)
    },
    port,
  })
}
