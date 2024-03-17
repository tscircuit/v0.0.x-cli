import { interactForPackageNameWithVersion } from "./interact-for-package-name-with-version"
import { ParamHandler } from "./param-handler-type"

export const interactForPackageReleaseId: ParamHandler = async (params) => {
  const { ctx, prompts } = params

  const package_name_with_version = await interactForPackageNameWithVersion(
    params
  )

  return await ctx.axios
    .post("/package_releases/get", {
      package_name_with_version,
    })
    .then((r) => r.data.package_release.package_release_id)
}
