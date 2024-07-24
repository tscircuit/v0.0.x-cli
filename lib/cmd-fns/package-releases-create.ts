import { AppContext } from "../util/app-context"
import { z } from "zod"
import kleur from "kleur"

export const packageReleasesCreate = async (ctx: AppContext, args: any) => {
  args.version = args.releaseVersion
  const params = z
    .object({
      packageNameWithVersion: z.string().optional(),
      packageName: z.string().optional(),
      version: z.string().optional(),
    })
    .refine((d) => {
      if (d.packageNameWithVersion) return true
      if (d.packageName && d.version) return true
      return false
    }, "Either packageNameWithVersion or packageName and version must be provided")
    .parse(args)

  let { packageNameWithVersion, packageName, version } = params

  if (!packageNameWithVersion) {
    packageNameWithVersion = `${packageName}@${version}`
  }

  const package_release = await ctx.axios
    .post("/package_releases/create", {
      package_name_with_version: packageNameWithVersion,
    })
    .then((r) => r.data.package_release)

  console.log(
    `Package release created! ${kleur.gray(package_release.package_release_id)}`,
  )
}
