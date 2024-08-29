import { AppContext } from "../util/app-context"
import { z } from "zod"
import $ from "dax-sh"
import * as Path from "path"
import { unlink } from "node:fs/promises"
import kleur from "kleur"
import { writeFileSync } from "fs"
import { readFile } from "fs/promises"
import Debug from "debug"
import { soupifyWithCore } from "./soupify-with-core"
import { getExportNameFromFile } from "./get-export-name-from-file"
import { getTmpEntrypointFilePath } from "./get-tmp-entrpoint-filepath"
import { runEntrypointFile } from "./run-entrypoint-file"

const debug = Debug("tscircuit:soupify")

export const soupifyWithBuilder = async (
  params: {
    filePath: string
    exportName?: string
    /**
     * Use @tscircuit/core instead of @tscircuit/builder, this will be the
     * default eventually
     */
    useCore?: boolean
  },
  ctx: Pick<AppContext, "runtime" | "params">,
) => {
  let { filePath, exportName, useCore } = params
  if (useCore) return soupifyWithCore(params, ctx)

  exportName ??= await getExportNameFromFile(filePath)

  const { tmpEntrypointPath, tmpOutputPath } =
    getTmpEntrypointFilePath(filePath)

  debug(`writing to ${tmpEntrypointPath}`)
  writeFileSync(
    tmpEntrypointPath,
    `
import React from "react"
import { createRoot } from "@tscircuit/react-fiber"
import { createProjectBuilder } from "@tscircuit/builder"
import { writeFileSync } from "node:fs"

let Component
try {
  const EXPORTS = await import("./${Path.basename(filePath)}")
  Component = EXPORTS["${exportName}"]
} catch (e) {
  writeFileSync("${tmpOutputPath}", JSON.stringify({
    COMPILE_ERROR: e.message + "\\n\\n" + e.stack,
  }))
}

if (!Component) {
  console.log(JSON.stringify({
    COMPILE_ERROR: 'Failed to find "${exportName}" export in "${filePath}"'
  }))
  writeFileSync("${tmpOutputPath}", JSON.stringify({
    COMPILE_ERROR: e.message + "\\n\\n" + e.stack,
  }))
  process.exit(0)
}

const projectBuilder = createProjectBuilder()
const elements = await createRoot().render(<Component />, projectBuilder)

writeFileSync("${tmpOutputPath}", JSON.stringify(elements))

`.trim(),
  )

  return await runEntrypointFile({ tmpEntrypointPath, tmpOutputPath }, ctx)
}

export const soupify = soupifyWithBuilder
