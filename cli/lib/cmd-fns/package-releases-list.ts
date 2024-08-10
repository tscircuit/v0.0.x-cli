import { AppContext } from "../util/app-context"
import { z } from "zod"

export const packageReleasesList = async (ctx: AppContext, args: any) => {
  const params = z
    .object({
      packageName: z.string().optional(),
      verbose: z.boolean().optional(),
    })
    .parse(args)

  const package_releases = await ctx.axios
    .post("/package_releases/list", {
      package_name: params.packageName,
    })
    .then((r) => r.data.package_releases)

  if (package_releases.length === 0) {
    console.log("No package releases found")
    return
  }

  if (params.verbose) {
    console.log(package_releases)
  } else {
    console.log(
      package_releases
        .map((f: any) => `${params.packageName}@${f.version}`)
        .join("\n"),
    )
  }
}
