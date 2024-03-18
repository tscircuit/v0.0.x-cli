import { unlinkSync } from "fs"
import { AppContext } from "../util/app-context"

export const configClear = async (ctx: AppContext, args: any) => {
  ctx.global_config.clear()
}
