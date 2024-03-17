import kleur from "kleur"
import { AppContext } from "lib/util/app-context"
import { z } from "zod"
import { createOrModifyNpmrc } from "./init/create-or-modify-npmrc"
import $ from "dax-sh"

export const uninstallCmd = async (ctx: AppContext, args: any) => {
  const params = z
    .object({
      packages: z.array(z.string()),
      flags: z.object({}).optional().default({}),
    })
    .parse(args)

  params.packages = params.packages.map((p) => p.replace(/^@/, ""))

  await createOrModifyNpmrc({ quiet: true }, ctx)

  $.cd(ctx.cwd)

  const flagsString = ""

  const cmd = `npm uninstall ${flagsString} ${params.packages
    .map((p) => `@tsci/${p.replace(/\//, ".")}`)
    .join(" ")}`
  console.log(kleur.gray(`> ${cmd}`))

  await $`npm uninstall ${flagsString} ${params.packages
    .map((p) => `@tsci/${p.replace(/\//, ".")}`)
    .join(" ")}`
}
