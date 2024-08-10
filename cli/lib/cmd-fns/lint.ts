import { AppContext } from "cli/lib/util/app-context"
import { z } from "zod"
import kleur from "kleur"
import { lintProject } from "../util/lint-project"

export const lintCmd = async (ctx: AppContext, args: any) => {
  const params = z
    .object({
      fix: z.boolean().optional().default(false),
    })
    .parse(args)

  const { cwd } = ctx
  const { fix } = params

  console.log(kleur.blue("Running tscircuit linter..."))

  const results = lintProject(cwd, fix)

  let errorCount = 0
  for (const result of results) {
    if (result.messages.length > 0) {
      console.log(kleur.yellow(`\nFile: ${result.filePath}`))
      for (const message of result.messages) {
        console.log(
          `  Line ${message.line}, Column ${message.column}: ${message.message}`,
        )
        errorCount++
      }
    }
  }

  if (errorCount > 0) {
    console.log(
      kleur.yellow(
        `\nFound ${errorCount} issue${errorCount === 1 ? "" : "s"} in your tscircuit code.`,
      ),
    )
    process.exit(1)
  } else {
    console.log(kleur.green("\nNo tscircuit-specific issues found!"))
  }
}
