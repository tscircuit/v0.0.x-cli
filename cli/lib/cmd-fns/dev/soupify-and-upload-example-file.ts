import kleur from "kleur"
import { join as joinPath } from "path"
import { AxiosInstance } from "axios"
import { readdirSync, readFileSync } from "fs"
import { soupify } from "cli/lib/soupify"
import { inferExportNameFromSource } from "./infer-export-name-from-source"
import { AppContext } from "cli/lib/util/app-context"

export const soupifyAndUploadExampleFile = async (
  {
    examplesDir,
    exampleFileName,
    devServerAxios,
  }: {
    examplesDir: string
    exampleFileName: string
    devServerAxios: AxiosInstance
  },
  ctx: Pick<AppContext, "runtime" | "params">,
) => {
  try {
    const startTime = Date.now()
    const examplePath = joinPath(examplesDir, exampleFileName)
    const exampleContent = readFileSync(examplePath).toString()

    const exportName = inferExportNameFromSource(exampleContent)

    console.log(kleur.gray(`[soupifying] ${exampleFileName}...`))
    const { soup, error } = await soupify(
      {
        filePath: examplePath,
        exportName,
      },
      ctx,
    )
      .then((soup) => ({ soup, error: null }))
      .catch((e) => ({ error: e, soup: undefined }))

    if (error) {
      console.log(kleur.red(`[   error  ] couldn't soupify ${exampleFileName}`))
      console.log(error.toString())
    }
    console.log(kleur.gray(`[uploading ] ${exampleFileName}...`))
    await devServerAxios.post("/api/dev_package_examples/create", {
      tscircuit_soup: soup,
      error: error?.toString() || null,
      file_path: examplePath,
      export_name: exportName,
      is_loading: false,
    })
    const timeTaken = Date.now() - startTime
    console.log(
      kleur.gray(
        `[   done   ] [ ${Math.round(timeTaken)
          .toString()
          .padStart(5, " ")}ms ] ${exampleFileName}!`,
      ),
    )
  } catch (e: any) {
    console.log(kleur.red(`[   error  ] ${e.toString()}`))
  }
}
