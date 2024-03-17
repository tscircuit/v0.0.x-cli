import kleur from "kleur"
import { AppContext } from "../util/app-context"

export const authLogout = async (ctx: AppContext, args: any) => {
  ctx.global_config.set("session", null)
  console.log(kleur.green("Logged out!"))
}
