import { AppContext } from "../util/app-context"
import { readFile } from "fs/promises"

export const configPrintConfig = async (ctx: AppContext, args: any) => {
  console.log((await readFile(ctx.global_config.path)).toString())
}
