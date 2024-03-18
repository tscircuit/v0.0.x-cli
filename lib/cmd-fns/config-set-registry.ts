import { AppContext } from "../util/app-context"
import { z } from "zod"

export const configSetRegistry = async (ctx: AppContext, args: any) => {
  const params = z.object({ server: z.string().url() }).parse(args)
  // don't want to re-use auth token
  ctx.profile_config.clear()
  ctx.profile_config.set("registry_url", params.server)
}
