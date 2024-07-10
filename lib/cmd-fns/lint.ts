import { AppContext } from "lib/util/app-context"
import { z } from "zod"
import kleur from "kleur"
import { ESLint } from "eslint"
import path from "path"
import * as glob from "glob"

export const lintCmd = async (ctx: AppContext, args: any) => {
  const params = z
    .object({
      fix: z.boolean().optional().default(false),
    })
    .parse(args)

  const { cwd } = ctx
  const { fix } = params

  console.log(kleur.blue("Running linter..."))

  // Initialize ESLint
  const eslint = new ESLint({
    useEslintrc: false,
    baseConfig: {
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
      ],
    },
    fix: fix,
    extensions: [".ts", ".tsx"],
    ignorePath: path.join(cwd, '.eslintignore'),
  })

  // Find all TypeScript files
  const files = glob.sync("**/*.{ts,tsx}", {
    cwd: cwd,
    ignore: ["**/node_modules/**", "dist/**"],
  })

  // Run ESLint
  const results = await eslint.lintFiles(files.map(file => path.join(cwd, file)))

  // Fix files if requested
  if (fix) {
    await ESLint.outputFixes(results)
  }

  // Format results
  const formatter = await eslint.loadFormatter("stylish")
  const resultText = formatter.format(results)

  // Output results
  console.log(resultText)

  // Determine if there were any errors
  const errorCount = results.reduce((count, result) => count + result.errorCount, 0)

  if (errorCount > 0) {
    console.log(kleur.red(`\nLinting failed with ${errorCount} error${errorCount === 1 ? '' : 's'}.`))
    process.exit(1)
  } else {
    console.log(kleur.green("\nLinting passed successfully!"))
  }
}