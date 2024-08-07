import { circuitToPng } from "circuit-to-png"
import fs from "fs"
import { soupify } from "lib/soupify"
import type { AppContext } from "lib/util/app-context"
import path from "path"

export const renderCmd = async (
  ctx: AppContext,
  args: {
    input: string
    pcb?: boolean
    schematic?: boolean
    output?: string
    type?: string
  },
) => {
  const inputFile = path.resolve(args.input)
  let outputFile = args.output
  const outputType =
    args.type || path.extname(args.output || "").slice(1) || "png"

  if (!outputFile) {
    const inputBase = path.basename(inputFile, path.extname(inputFile))
    outputFile = `${inputBase}.${outputType}`
  }

  if (!args.pcb && !args.schematic) {
    console.error("Error: You must specify either --pcb or --schematic")
    process.exit(1)
  }

  const viewType = args.pcb ? "pcb" : "schematic"

  console.log(`Rendering ${viewType} view of ${inputFile} to ${outputFile}`)
  const soup = await soupify(
    {
      filePath: inputFile,
    },
    ctx,
  )

  const soupBuffer = circuitToPng(soup, viewType)

  fs.writeFileSync(outputFile, soupBuffer)
}
