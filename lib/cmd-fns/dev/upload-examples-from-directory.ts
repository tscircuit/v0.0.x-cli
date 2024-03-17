import kleur from "kleur"
import { join as joinPath } from "path"
import { AxiosInstance } from "axios"
import { readdirSync, readFileSync } from "fs"
import { soupify } from "lib/soupify"
import { soupifyAndUploadExampleFile } from "./soupify-and-upload-example-file"

export const uploadExamplesFromDirectory = async ({
  cwd,
  devServerAxios,
}: {
  cwd: string
  devServerAxios: AxiosInstance
}) => {
  const examplesDir = joinPath(cwd, "examples")
  const exampleFileNames = readdirSync(examplesDir)
  for (const exampleFileName of exampleFileNames) {
    if (exampleFileName.endsWith(".__tmp_entrypoint.tsx")) continue
    if (!exampleFileName.endsWith(".tsx")) continue
    await soupifyAndUploadExampleFile({
      devServerAxios,
      examplesDir,
      exampleFileName,
    })
  }
}
