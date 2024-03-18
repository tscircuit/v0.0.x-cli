import kleur from "kleur"
import { AppContext } from "../util/app-context"

export const authLogout = async (ctx: AppContext, args: any) => {
  ctx.profile_config.delete("session_token")
  console.log(kleur.green("Logged out!"))
}
