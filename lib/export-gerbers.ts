import { AppContext } from "./util/app-context"
import { z } from "zod"
import * as Path from "path"
import { unlink } from "node:fs/promises"
import { soupify } from "lib/soupify"
import * as fs from "fs"
import {
  stringifyGerberCommandLayers,
  convertSoupToGerberCommands,
} from "@tscircuit/builder"
import kleur from "kleur"
import archiver from "archiver"

export const exportGerbersToFile = async (
  params: {
    example_file_path: string
    export_name?: string
    output_zip_path: string
  },
  ctx: AppContext
) => {
  console.log(kleur.gray("[soupifying]..."))
  const soup = await soupify(
    {
      filePath: params.example_file_path,
      exportName: params.export_name,
    },
    ctx
  )

  console.log(kleur.gray("[soup to gerber json]..."))
  const gerber_layer_cmds = convertSoupToGerberCommands(soup)

  console.log(kleur.gray("[stringify gerber json]..."))
  const gerber_file_contents = stringifyGerberCommandLayers(gerber_layer_cmds)

  console.log(kleur.gray("[writing gerbers to tmp dir]..."))
  const tempDir = Path.join(".tscircuit", "tmp-gerber-export")
  fs.mkdirSync(tempDir, { recursive: true })
  for (const [fileName, fileContents] of Object.entries(gerber_file_contents)) {
    const filePath = Path.join(tempDir, fileName)
    await fs.writeFileSync(filePath, fileContents)
  }

  console.log(kleur.gray("[zipping tmp dir]..."))
  const output = fs.createWriteStream(params.output_zip_path)

  if (typeof Bun !== "undefined") {
    throw new Error(
      `Exporting gerbers doesn't currently work with Bun (bug w/ archiver module)`
    )
  }

  const archive = archiver("zip", {
    zlib: { level: 9 },
  })

  archive.pipe(output)
  archive.directory(tempDir, false)

  await new Promise((resolve, reject) => {
    output.on("close", resolve)
    output.on("finish", resolve)
    output.on("end", resolve)
    output.on("error", reject)
    archive.finalize()
  })
}

export const exportGerbersToZipBuffer = async (
  params: {
    example_file_path: string
    export_name?: string
  },
  ctx: AppContext
) => {
  const tempDir = Path.join(".tscircuit", "tmp-gerber-zip")
  fs.mkdirSync(tempDir, { recursive: true })

  await exportGerbersToFile(
    {
      example_file_path: params.example_file_path,
      export_name: params.export_name,
      output_zip_path: Path.join(tempDir, "gerbers.zip"),
    },
    ctx
  )

  const buffer = fs.readFileSync(Path.join(tempDir, "gerbers.zip"))

  fs.rmSync(tempDir, { recursive: true })

  return buffer
}
