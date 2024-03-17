import { interactForPackageReleaseId } from "./interact-for-package-release-id"
import { ParamHandler } from "./param-handler-type"

export const interactForPackageExampleId: ParamHandler = async (params) => {
  const { prompts, ctx } = params
  const package_release_id = await interactForPackageReleaseId(params)

  const package_examples = await ctx.axios
    .post("/package_examples/list", {
      package_release_id,
    })
    .then((r) => r.data.package_examples)

  const { package_example_id } = await prompts({
    type: "autocomplete",
    name: "package_example_id",
    message: "Select a package example",
    choices: package_examples.map((p: any) => ({
      title: `${p.file_path} (${p.export_name})`,
      value: p.package_example_id,
    })),
  })

  return package_example_id
}
