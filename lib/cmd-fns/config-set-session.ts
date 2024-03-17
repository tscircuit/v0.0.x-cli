import { AppContext } from "../util/app-context"
import { z } from "zod"

export const configSetSession = async (ctx: AppContext, args: any) => {
  const params = z.object({ sessionToken: z.string() }).parse(args)
  ctx.profile_config.set("session_token", params.sessionToken)
}
