import { AppContext } from "../util/app-context"
import { z } from "zod"
import * as fs from "fs/promises"

export const packageFilesDownload = async (ctx: AppContext, args: any) => {
  const params = z
    .object({
      packageNameWithVersion: z.string().optional(),
      remoteFilePath: z.string().optional(),
      output: z.string().optional(),
    })
    .parse(args)

  const { packageNameWithVersion, remoteFilePath } = params

  const packageContent = await ctx.axios
    .post("/package_files/download", {
      package_name_with_version: packageNameWithVersion,
      file_path: remoteFilePath,
    })
    .then((r) => r.data)

  if (params.output) {
    console.log("Writing to", params.output)
    await fs.writeFile(params.output, packageContent)
  } else {
    console.log(packageContent)
  }
}
