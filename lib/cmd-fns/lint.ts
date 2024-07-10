import { ESLint } from "eslint"
import * as glob from "glob"
import kleur from "kleur"
import { AppContext } from "lib/util/app-context"
import path from "path"
import { z } from "zod"
import { Rule } from "eslint"

const tscircuitPlugin = {
  rules: {
    "capacitor-unit": {
      meta: {
        type: "problem",
        docs: {
          description: "Ensure capacitor values include units",
          category: "Possible Errors",
          recommended: true,
        },
        fixable: "code",
      },
      create(context: Rule.RuleContext) {
        return {
          CallExpression(node: any) {
            if (node.callee.name === 'Capacitor') {
              const valueArg = node.arguments.find((arg: any) => arg.type === 'ObjectExpression')
              if (valueArg) {
                const valueProp = valueArg.properties.find((prop: any) => prop.key.name === 'value')
                if (valueProp && valueProp.value.type === 'Literal') {
                  const value = valueProp.value.value
                  if (typeof value === 'string' && !value.match(/[µuμ]F$/)) {
                    context.report({
                      node: valueProp,
                      message: 'Capacitor value should include units (e.g., "100µF")',
                      fix(fixer) {
                        return fixer.replaceText(valueProp.value, `"${value}µF"`)
                      }
                    })
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

export const lintCmd = async (ctx: AppContext, args: any) => {
  const params = z
    .object({
      fix: z.boolean().optional().default(false),
    })
    .parse(args)

  const { cwd } = ctx
  const { fix } = params

  console.log(kleur.blue("Running tscircuit linter..."))

  const eslint = new ESLint({
    useEslintrc: false,
    baseConfig: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      plugins: ["tscircuit"],
      rules: {
        "tscircuit/capacitor-unit": "error" // or "warn" if you prefer
      }
    },
    fix,
    extensions: [".ts", ".tsx"],
    plugins: {
      tscircuit: tscircuitPlugin
    }
  })

  const files = glob.sync("**/*.{ts,tsx}", {
    cwd,
    ignore: ["**/node_modules/**", "dist/**"],
  })

  try {
    const results = await eslint.lintFiles(
      files.map((file) => path.join(cwd, file))
    )

    if (fix) {
      await ESLint.outputFixes(results)
    }

    const formatter = await eslint.loadFormatter("stylish")
    const resultText = formatter.format(results)

    console.log(resultText)

    const errorCount = results.reduce(
      (count, result) => count + result.errorCount,
      0
    )

    if (errorCount > 0) {
      console.log(
        kleur.yellow(
          `\nFound ${errorCount} issue${
            errorCount === 1 ? "" : "s"
          } in your tscircuit code.`
        )
      )
      process.exit(1)
    } else {
      console.log(kleur.green("\nNo tscircuit-specific issues found!"))
    }
  } catch (error) {
    console.error(kleur.red("An error occurred during linting:"))
    console.error(error)
    process.exit(1)
  }
}
