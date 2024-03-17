import { AppContext } from "../util/app-context"
import { z } from "zod"

export const configSetRegistry = async (ctx: AppContext, args: any) => {
  const params = z.object({ server: z.string().url() }).parse(args)
  ctx.profile_config.set("registry_url", params.server)
}
