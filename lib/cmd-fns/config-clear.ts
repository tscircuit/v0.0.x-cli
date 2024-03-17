import { unlinkSync } from "fs"
import { AppContext } from "../util/app-context"

export const configClear = async (ctx: AppContext, args: any) => {
  unlinkSync(ctx.global_config.path)
}
