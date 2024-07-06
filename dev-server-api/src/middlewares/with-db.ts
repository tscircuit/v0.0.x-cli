import type { Middleware } from "winterspec"
import { getDb } from "../db/get-db"
import type { ZodLevelDatabase } from "src/db/level-db"

export const withDb: Middleware<
  {},
  {
    db: ZodLevelDatabase
  }
> = async (req, ctx, next) => {
  if (!ctx.db) {
    ctx.db = await getDb()
  }
  return next(req, ctx)
}
