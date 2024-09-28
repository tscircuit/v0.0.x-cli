import { existsSync, writeFileSync } from "fs"
import kleur from "kleur"
import * as Path from "path/posix"
import { getGeneratedNpmrc } from "./get-generated-npmrc"
import { AppContext } from "cli/lib/util/app-context"

export const createOrModifyNpmrc = async (
  { quiet = true }: { quiet?: boolean },
  ctx: AppContext,
) => {
  const npmrcPath = Path.join(ctx.cwd, ".npmrc")

  if (existsSync(npmrcPath)) {
    // TODO check that @tsci registry is correctly set
    if (!quiet) {
      console.log(kleur.yellow("npmrc already exists, not doing anything"))
    }
  } else {
    writeFileSync(npmrcPath, getGeneratedNpmrc(ctx))
  }
}
