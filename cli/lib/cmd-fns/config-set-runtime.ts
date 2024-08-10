import { AppContext } from "../util/app-context"
import { z } from "zod"

export const configSetRuntime = async (ctx: AppContext, args: any) => {
  const params = z.object({ runtime: z.enum(["bun", "node"]) }).parse(args)
  ctx.global_config.set("runtime", params.runtime)
}
