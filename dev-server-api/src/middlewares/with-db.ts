import type { Middleware } from "winterspec"
import { getDb } from "../db/get-db"
import type { ZodLevelDatabase } from "src/db/zod-level-db"

export const withDb: Middleware<
  {},
  {
    db: ZodLevelDatabase
  }
> = async (req, ctx, next) => {
  if (!ctx.db) {
    ctx.db = await getDb()
  }
  // await ctx.db.open()
  const res = await next(req, ctx)
  // await ctx.db.close()
  return res
}
