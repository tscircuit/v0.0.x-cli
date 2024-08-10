import type { Middleware } from "winterspec"
import Debug from "debug"

const debug = Debug("tscircuit:cli:api")

export const withDebugRequestLogging: Middleware<{}, {}> = async (
  req,
  ctx,
  next,
) => {
  debug(`[REQ] ${req.method?.toUpperCase()} ${req.url}`)
  return next(req, ctx)
}
