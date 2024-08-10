import { AppContext } from "../util/app-context"
import { z } from "zod"

export const configSetLogRequests = async (ctx: AppContext, args: any) => {
  const params = z.object({ logRequests: z.boolean() }).parse(args)
  ctx.global_config.set("log_requests", params.logRequests)
}
