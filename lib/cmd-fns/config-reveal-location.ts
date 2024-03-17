import { AppContext } from "../util/app-context"

export const configRevealLocation = async (ctx: AppContext, args: any) => {
  console.log(`tsci config path: ${ctx.global_config.path}`)
}
