import { AppContext } from "../util/app-context"

export const authSessionsList = async (ctx: AppContext, args: any) => {
  await ctx.axios.get("/sessions/list")
}
