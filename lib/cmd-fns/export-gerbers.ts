import { AppContext } from "../util/app-context"
import { z } from "zod"
import * as Path from "path"
import { unlink } from "node:fs/promises"
import { soupify } from "lib/soupify"
import * as fs from "fs"
import {
  stringifyGerberCommandLayers,
  convertSoupToGerberCommands,
} from "@tscircuit/builder"
import { zip } from "zip-a-folder"
import kleur from "kleur"
import archiver from "archiver"

export const exportGerbersCmd = async (ctx: AppContext, args: any) => {
  const params = z
    .object({
      file: z.string(),
      export: z.string().optional(),
      outputfile: z.string().optional().default("gerbers.zip"),
    })
    .parse(args)

  console.log(kleur.gray("[soupifying]..."))
  const soup = await soupify(
    {
      filePath: params.file,
      exportName: params.export,
    },
    ctx
  )

  console.log(kleur.gray("[soup to gerber json]..."))
  const gerber_layer_cmds = convertSoupToGerberCommands(soup)

  console.log(kleur.gray("[stringify gerber json]..."))
  const gerber_file_contents = stringifyGerberCommandLayers(gerber_layer_cmds)

  console.log(kleur.gray("[writing gerbers to tmp dir]..."))
  const tempDir = Path.join(".tscircuit", "tmp-gerber-export")
  await fs.mkdirSync(tempDir, { recursive: true })
  for (const [fileName, fileContents] of Object.entries(gerber_file_contents)) {
    const filePath = Path.join(tempDir, fileName)
    await fs.writeFileSync(filePath, fileContents)
  }

  console.log(kleur.gray("[zipping tmp dir]..."))
  const output = fs.createWriteStream(params.outputfile)
  const archive = archiver("zip", {
    zlib: { level: 9 },
  })

  archive.pipe(output)
  archive.directory(tempDir, false)

  await new Promise((resolve, reject) => {
    output.on("close", resolve)
    output.on("error", reject)
  })
}
