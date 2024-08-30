import { readFile } from "node:fs/promises"
import Debug from "debug"

const debug = Debug("tscircuit:soupify")

export const getExportNameFromFile = async (filePath: string) => {
  debug(`reading ${filePath}`)
  const targetFileContent = await readFile(filePath, "utf-8")

  let exportName: string | undefined
  if (targetFileContent.includes("export default")) {
    exportName = "default"
  } else {
    // Look for "export const <name>" or "export function <name>"
    const exportRegex = /export\s+(?:const|function)\s+(\w+)/g
    const match = exportRegex.exec(targetFileContent)
    if (match) {
      exportName = match[1]
    }
  }

  if (!exportName) {
    throw new Error(
      `Couldn't derive an export name and didn't find default export in "${filePath}"`,
    )
  }

  return exportName
}
