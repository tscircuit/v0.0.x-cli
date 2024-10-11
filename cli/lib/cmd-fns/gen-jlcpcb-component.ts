import path from "path"
import fs from "fs/promises"
import { AppContext } from "../util/app-context"
import { convertEasyEdaJsonToVariousFormats } from "easyeda"

export const genJlcpcbComponent = async (
  ctx: AppContext,
  args: { partNumber: string },
) => {
  const normalizedPartNumber = args.partNumber.toUpperCase()

  const outputDir = path.resolve(ctx.cwd, "gen")
  const outputFile = path.join(outputDir, `${normalizedPartNumber}.tsx`)
  await fs.mkdir(outputDir, { recursive: true })

  await convertEasyEdaJsonToVariousFormats({
    jlcpcbPartNumberOrFilepath: normalizedPartNumber,
    outputFilename: outputFile,
    formatType: "tsx",
  })
}
