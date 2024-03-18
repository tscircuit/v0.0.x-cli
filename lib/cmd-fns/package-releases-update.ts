import { AppContext } from "../util/app-context"
import { z } from "zod"
import kleur from "kleur"

export const packageReleasesUpdate = async (ctx: AppContext, args: any) => {
  const params = z
    .object({
      packageNameWithVersion: z.string().optional(),
      packageName: z.string().optional(),
      version: z.string().optional(),
      isLatest: z.boolean().optional(),
      isLocked: z.boolean().optional(),
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

  const delta: {
    is_latest?: boolean
    is_locked?: boolean
  } = {}

  if (params.isLatest !== undefined) {
    delta.is_latest = params.isLatest
  }
  if (params.isLocked !== undefined) {
    delta.is_locked = params.isLocked
  }

  await ctx.axios.post("/package_releases/update", {
    package_name_with_version: packageNameWithVersion,
    ...delta,
  })

  console.log(`Package release updated!`)
}
