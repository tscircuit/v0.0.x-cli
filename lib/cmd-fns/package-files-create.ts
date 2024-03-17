import { AppContext } from "../util/app-context"
import { z } from "zod"
import * as fs from "fs/promises"
import kleur from "kleur"

export const packageFilesCreate = async (ctx: AppContext, args: any) => {
  const params = z
    .object({
      file: z.string(),
      packageReleaseId: z.string().optional(),
      packageNameWithVersion: z.string().optional(),
    })
    .parse(args)

  const { file, packageNameWithVersion, packageReleaseId } = params

  const fileContent = await fs.readFile(file)

  const package_file = await ctx.axios
    .post("/package_files/create", {
      file_path: file,
      content_text: fileContent.toString(),
      package_name_with_version: packageNameWithVersion,
      package_release_id: packageReleaseId,
    })
    .then((r) => r.data.package_file)

  console.log(
    `Package file created ${kleur.gray(package_file.package_file_id)}`
  )
}
