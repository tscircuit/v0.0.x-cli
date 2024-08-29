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
    getTmpEntrypointFilePath(filePath)

  debug(`writing to ${tmpEntrypointPath}`)
  writeFileSync(
    tmpEntrypointPath,
    `
import React from "react"
import { Project } from "@tscircuit/core"
import * as EXPORTS from "./${Path.basename(filePath)}"
import { writeFileSync } from "node:fs"

const Component = EXPORTS["${exportName}"]

const project = new Project()

project.add(<Component />)

project.render()

writeFileSync("${tmpOutputPath}", JSON.stringify(project.getCircuitJson()))
`.trim(),
  )

  await runEntrypointFile({ tmpEntrypointPath, tmpOutputPath }, ctx)
}
