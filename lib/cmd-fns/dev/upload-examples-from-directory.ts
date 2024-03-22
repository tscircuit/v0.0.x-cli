import kleur from "kleur"
import { join as joinPath } from "path"
import { AxiosInstance } from "axios"
import { readdirSync, readFileSync } from "fs"
import { soupify } from "lib/soupify"
import { soupifyAndUploadExampleFile } from "./soupify-and-upload-example-file"
import { markAllExamplesLoading } from "./mark-all-examples-loading"

export const uploadExamplesFromDirectory = async (
  {
    cwd,
    devServerAxios,
  }: {
    cwd: string
    devServerAxios: AxiosInstance
  },
  ctx: { runtime: "node" | "bun" }
) => {
  const examplesDir = joinPath(cwd, "examples")
  const exampleFileNames = readdirSync(examplesDir)

  // Mark all examples as being "reloaded" in the database
  await markAllExamplesLoading({ devServerAxios })

  for (const exampleFileName of exampleFileNames) {
    if (exampleFileName.endsWith(".__tmp_entrypoint.tsx")) continue
    if (!exampleFileName.endsWith(".tsx")) continue
    await soupifyAndUploadExampleFile(
      {
        devServerAxios,
        examplesDir,
        exampleFileName,
      },
      ctx
    )
  }
}
