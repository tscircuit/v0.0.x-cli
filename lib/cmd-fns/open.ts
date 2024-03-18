import { existsSync, readFileSync } from "fs"
import kleur from "kleur"
import { AppContext } from "lib/util/app-context"
import * as Path from "path"
import open from "open"

export const openCmd = async (ctx: AppContext, args: any) => {
  const packageJsonPath = Path.join(ctx.cwd, "package.json")
  if (!existsSync(packageJsonPath)) {
    console.log(kleur.red("No package.json found in current directory"))
    process.exit(1)
  }
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"))

  const registryUrl = `${ctx.registry_url}/${packageJson.name.replace("@", "")}`

  console.log(`Opening ${registryUrl} in your browser...`)
  await open(registryUrl)
}
