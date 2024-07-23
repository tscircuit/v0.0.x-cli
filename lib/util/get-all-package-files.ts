import * as fs from "fs/promises"
import { AppContext } from "./app-context"
import * as Glob from "glob"
import ignore from "ignore"

/**
 * Get all package files
 *
 * Package files are any files that aren't explicitly ignored in the
 * .npmignore (or if that doesn't exist, the .gitignore). All package
 * files must have a .ts or .tsx extension.
 *
 * Returns an array of files paths.
 */
export const getAllPackageFiles = async (
  ctx: AppContext
): Promise<Array<string>> => {
  await ensureNodeModulesIgnored()

  const [gitIgnore, promptIgnore, npmIgnore] = await Promise.all([
    readIgnoreFile("./.gitignore"),
    readIgnoreFile("./.promptignore"),
    readIgnoreFile("./.npmignore"),
  ])

  const npmAndPromptIgnoreFiles = [
    ...(promptIgnore ?? []),
    ...(npmIgnore ?? []),
  ]

  const ig = ignore().add([
    ...(npmAndPromptIgnoreFiles.length > 0
      ? npmAndPromptIgnoreFiles
      : gitIgnore ?? []),
    ".tscircuit",
    "node_modules/*",
  ])

  return Glob.globSync("**/*.{ts,tsx,md}", {}).filter((fp) => !ig.ignores(fp))
}

const readIgnoreFile = async (filePath: string): Promise<string[] | null> =>
  await fs
    .readFile(filePath)
    .then((b) => b.toString().split("\n").filter(Boolean))
    .catch((e) => null)

/**
 * Ensure 'node_modules/' is in .gitignore
 */
const ensureNodeModulesIgnored = async () => {
  const gitignorePath = "./.gitignore"

  try {
    const gitignore = await fs.readFile(gitignorePath, "utf8")
    if (!gitignore.includes("node_modules/")) {
      await fs.appendFile(gitignorePath, "\nnode_modules/\n")
    }
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.writeFile(gitignorePath, "node_modules/\n")
    } else {
      console.error("Error while updating .gitignore:", err)
    }
  }
}
