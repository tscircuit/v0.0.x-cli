import { AppContext } from "./util/app-context"
import { z } from "zod"
import $ from "dax-sh"
import * as Path from "path"
import { unlink } from "node:fs/promises"
import kleur from "kleur"
import { writeFileSync } from "fs"
import { readFile } from "fs/promises"
import Debug from "debug"

const debug = Debug("tscircuit:soupify")

export const soupify = async (
  {
    filePath,
    exportName,
  }: {
    filePath: string
    exportName?: string
  },
  ctx: Pick<AppContext, "runtime" | "params">,
) => {
  debug(`reading ${filePath}`)
  const targetFileContent = await readFile(filePath, "utf-8")

  if (!exportName) {
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
  }

  if (!exportName) {
    throw new Error(
      `Couldn't derive an export name and didn't find default export in "${filePath}"`,
    )
  }

  const tmpFilePath = Path.join(
    Path.dirname(filePath),
    Path.basename(filePath).replace(/\.[^\.]+$/, "") + ".__tmp_entrypoint.tsx",
  )

  debug(`writing to ${tmpFilePath}`)
  writeFileSync(
    tmpFilePath,
    `
import React from "react"
import { createRoot } from "@tscircuit/react-fiber"
import { createProjectBuilder } from "@tscircuit/builder"

import * as EXPORTS from "./${Path.basename(filePath)}"

const Component = EXPORTS["${exportName}"]

if (!Component) {
  console.log(JSON.stringify({
    COMPILE_ERROR: 'Failed to find "${exportName}" export in "${filePath}"'
  }))
  process.exit(0)
}

const projectBuilder = createProjectBuilder()
const elements = await createRoot().render(<Component />, projectBuilder)

console.log(JSON.stringify(elements))

`.trim(),
  )

  debug(`using runtime ${ctx.runtime}`)
  const processCmdPart1 =
    ctx.runtime === "node" ? $`npx tsx ${tmpFilePath}` : $`bun ${tmpFilePath}`

  debug(`starting process....`)
  const processResult = await processCmdPart1
    .stdout(debug.enabled ? "inheritPiped" : "piped")
    .stderr(debug.enabled ? "inheritPiped" : "piped")
    .noThrow()

  // TODO we should send it to a temporarty file rather than rely on stdout
  // which can easily be polluted
  const rawSoup = processResult.stdout.replace(/^[^\[]*/, "")
  const errText = processResult.stderr

  if (ctx.params.cleanup !== false) {
    debug(`deleting ${tmpFilePath}`)
    await unlink(tmpFilePath)
  }

  try {
    debug(`parsing result of soupify...`)
    const soup = JSON.parse(rawSoup)

    if (soup.COMPILE_ERROR) {
      // console.log(kleur.red(`Failed to compile ${filePath}`))
      console.log(kleur.red(soup.COMPILE_ERROR))
      throw new Error(soup.COMPILE_ERROR)
    }

    return soup
  } catch (e: any) {
    // console.log(kleur.red(`Failed to parse result of soupify: ${e.toString()}`))
    const t = Date.now()
    console.log(`Dumping raw output to .tscircuit/err-${t}.log`)
    writeFileSync(`.tscircuit/err-${t}.log`, rawSoup + "\n\n" + errText)
    throw new Error(errText)
  }
}
