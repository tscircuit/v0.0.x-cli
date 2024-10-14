import Debug from "debug"
import { writeFileSync } from "fs"
import { readFile, unlink } from "node:fs/promises"
import $ from "dax-sh"
import kleur from "kleur"
import { AppContext } from "../util/app-context"

const debug = Debug("tscircuit:soupify")

/**
 * Runs the entrypoint file to generate circuit json (soup) for a given file
 */
export const runEntrypointFile = async (
  {
    tmpEntrypointPath,
    tmpOutputPath,
  }: { tmpEntrypointPath: string; tmpOutputPath: string },
  ctx: Pick<AppContext, "runtime" | "params">,
) => {
  debug(`using runtime ${ctx.runtime}`)
  const processCmdPart1 =
    ctx.runtime === "node"
      ? $`npx tsx ${tmpEntrypointPath}`
      : $`bun ${tmpEntrypointPath}`
  debug(`starting process....`)

  const processResult = await processCmdPart1
    .stderr(debug.enabled ? "inheritPiped" : "piped")
    .stdout(debug.enabled ? "inheritPiped" : "piped")
    .noThrow()

  const rawSoup = await readFile(tmpOutputPath, "utf-8")
  const errText = processResult.stderr

  if (ctx.params.cleanup !== false) {
    debug(`deleting ${tmpEntrypointPath}`)
    await unlink(tmpEntrypointPath)
    debug(`deleting ${tmpOutputPath}`)
    await unlink(tmpOutputPath)
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
