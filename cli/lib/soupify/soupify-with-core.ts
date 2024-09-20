import { AppContext } from "../util/app-context"
import { z } from "zod"
import $ from "dax-sh"
import * as Path from "path"
import { unlink } from "node:fs/promises"
import kleur from "kleur"
import { writeFileSync } from "fs"
import { readFile } from "fs/promises"
import Debug from "debug"
import { getExportNameFromFile } from "./get-export-name-from-file"
import { getTmpEntrypointFilePath } from "./get-tmp-entrpoint-filepath"
import { runEntrypointFile } from "./run-entrypoint-file"
import fs from "node:fs/promises"

const debug = Debug("tscircuit:soupify")

export const soupifyWithCore = async (
  params: {
    filePath: string
    exportName?: string
  },
  ctx: Pick<AppContext, "runtime" | "params">,
) => {
  let { filePath, exportName } = params

  exportName ??= await getExportNameFromFile(filePath)

  const { tmpEntrypointPath, tmpOutputPath } =
    await getTmpEntrypointFilePath(filePath)

  // Remove existing entrypoint or tmp output files
  await fs.unlink(tmpEntrypointPath).catch(() => {})
  await fs.unlink(tmpOutputPath).catch(() => {})

  debug(`writing to ${tmpEntrypointPath}`)
  writeFileSync(
    tmpEntrypointPath,
    `
import React from "react"
import { Circuit } from "@tscircuit/core"
import * as EXPORTS from "./${Path.basename(filePath)}"
import { writeFileSync } from "node:fs"

const Component = EXPORTS["${exportName}"]

const project = new Circuit()

try {
  project.add(<Component />)
} catch (e: any) {
  console.log("[during .add()] ", e.toString())
  writeFileSync("${tmpOutputPath}", JSON.stringify({
    COMPILE_ERROR: e.toString() + "\\n\\n" + e.stack,
  }))
  throw e
}

try {
  project.render()
} catch (e: any) {
  console.log(e.toString())
  writeFileSync("${tmpOutputPath}", JSON.stringify({
    COMPILE_ERROR: e.toString() + "\\n\\n" + e.stack,
  }))
  throw e
}


writeFileSync("${tmpOutputPath}", JSON.stringify(project.getCircuitJson()))
`.trim(),
  )

  return await runEntrypointFile({ tmpEntrypointPath, tmpOutputPath }, ctx)
}
