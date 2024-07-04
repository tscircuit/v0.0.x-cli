import type { Middleware } from "winterspec"
import { getDb, type DbClient } from "../db/get-db"

export const withDb: Middleware<
  {},
  {
    db: DbClient
  }
> = async (req, ctx, next) => {
  if (!ctx.db) {
    ctx.db = await getDb()
  }
  return next(req, ctx)
}
