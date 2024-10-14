import kleur from "kleur"
import { join as joinPath } from "path/posix"
import { AxiosInstance } from "axios"
import { readdirSync, readFileSync } from "fs"
import { soupify } from "cli/lib/soupify"
import { soupifyAndUploadExampleFile } from "./soupify-and-upload-example-file"
import { markAllExamplesLoading } from "./mark-all-examples-loading"
import { readdir } from "fs/promises"
import { AppContext } from "cli/lib/util/app-context"

export const uploadExamplesFromDirectory = async (
  {
    cwd,
    devServerAxios,
  }: {
    cwd: string
    devServerAxios: AxiosInstance
  },
  ctx: Pick<AppContext, "runtime" | "params">,
) => {
  const examplesDir = joinPath(cwd, "examples")
  const exampleFileNames = await readdir(examplesDir).catch((e) => {
    console.log(kleur.red(`Error reading examples directory: "${examplesDir}"`))
    throw e
  })

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
      ctx,
    )
  }
}
