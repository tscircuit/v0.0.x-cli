import { AppContext } from "lib/util/app-context"
import packageJson from "./../../package.json"

export const versionCmd = async (ctx: AppContext, args: any) => {
  console.log(`tsci v${packageJson.version}`)
}
