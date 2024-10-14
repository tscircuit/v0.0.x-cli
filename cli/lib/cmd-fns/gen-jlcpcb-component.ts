import path from "path"
import fs from "fs/promises"
import { AppContext } from "../util/app-context"
import { convertEasyEdaJsonToVariousFormats } from "easyeda"

export const genJlcpcbComponent = async (
  ctx: AppContext,
  { partNumberOrUrl }: { partNumberOrUrl: string },
): Promise<void> => {
  try {
    const resolvedPartNumber = resolvePartNumber(partNumberOrUrl)
    const outputDir = path.resolve(ctx.cwd, "gen")
    const outputFile = path.join(outputDir, `${resolvedPartNumber}.tsx`)

    await fs.mkdir(outputDir, { recursive: true })

    await convertEasyEdaJsonToVariousFormats({
      jlcpcbPartNumberOrFilepath: resolvedPartNumber,
      outputFilename: outputFile,
      formatType: "tsx",
    })
  } catch (error) {
    console.error(
      `Error generating JLCPCB component:`,
      (error as Error).message,
    )
    throw error
  }
}

const PART_NUMBER_PREFIX = "C"

const resolvePartNumber = (partNumberOrUrl: string): string => {
  if (
    partNumberOrUrl.startsWith("http://") ||
    partNumberOrUrl.startsWith("https://")
  ) {
    const partNumber = extractPartNumberFromUrl(partNumberOrUrl)

    if (!partNumber) {
      throw new Error("Could not extract a valid part number from URL")
    }

    return partNumber
  }

  if (!isValidPartNumber(partNumberOrUrl)) {
    throw new Error(
      `Invalid part number: Must start with '${PART_NUMBER_PREFIX}'`,
    )
  }

  return partNumberOrUrl.toUpperCase()
}

const extractPartNumberFromUrl = (url: string): string | null => {
  const partNumber = url.split("/").at(-1)
  return partNumber && isValidPartNumber(partNumber)
    ? partNumber.toUpperCase()
    : null
}

const isValidPartNumber = (partNumber: string): boolean =>
  partNumber.toUpperCase().startsWith(PART_NUMBER_PREFIX)
