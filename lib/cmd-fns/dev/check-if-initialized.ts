import { AppContext } from "../../util/app-context"
import kleur from "kleur"
import * as Path from "path"
import { existsSync, readFileSync } from "fs"

export const checkIfInitialized = async (ctx: AppContext) => {
  const packageJsonPath = Path.join(ctx.cwd, "package.json")
  if (!existsSync(packageJsonPath)) {
    console.error(kleur.red(`No package.json found`))
    return false
  }

  const packageJsonRaw = readFileSync(packageJsonPath, "utf-8")
  if (!packageJsonRaw.includes("tscircuit")) {
    console.error(
      kleur.red(`No tscircuit dependencies are installed in this project.`),
    )
    return false
  }

  return true
}
