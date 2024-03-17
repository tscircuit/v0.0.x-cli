import { AppContext } from "../util/app-context"
import { z } from "zod"

export const packageFilesList = async (ctx: AppContext, args: any) => {
  const params = z
    .object({
      packageReleaseId: z.string().optional(),
      packageName: z.string().optional(),
      packageNameWithVersion: z.string().optional(),
      verbose: z.boolean().optional(),
    })
    .parse(args)

  const package_files = await ctx.axios
    .post("/package_files/list", {
      package_release_id: params.packageReleaseId,
      package_name: params.packageName,
      use_latest_version: Boolean(params.packageName),
      package_name_with_version: params.packageNameWithVersion,
    })
    .then((r) => r.data.package_files)

  if (params.verbose) {
    console.log(package_files)
  } else {
    console.log(package_files.map((f: any) => f.file_path).join("\n"))
  }
}
