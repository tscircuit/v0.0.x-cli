import { AppContext } from "./util/app-context"
import { z } from "zod"
import $ from "dax-sh"
import * as Path from "path"
import { unlink } from "node:fs/promises"
import kleur from "kleur"
import { writeFileSync } from "fs"

export const soupify = async ({
  filePath,
  exportName,
}: {
  filePath: string
  exportName?: string
}) => {
  const tmpFilePath = Path.join(
    Path.dirname(filePath),
    Path.basename(filePath).replace(/\.[^\.]+$/, "") + ".__tmp_entrypoint.tsx"
  )

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

`.trim()
  )

  const processResult = await $`npx tsx ${tmpFilePath}`
    .stdout("piped")
    .stderr("piped")
    .noThrow()

  const rawSoup = processResult.stdout
  const errText = processResult.stderr

  await unlink(tmpFilePath)

  try {
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
