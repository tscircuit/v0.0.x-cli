import { ParamHandler } from "./param-handler-type"
import * as fs from "fs/promises"

export const interactForPackageName: ParamHandler = async ({
  prompts,
  ctx,
}) => {
  // Find all package names by this user
  const myPackages: Array<{ name: string }> = await ctx.axios
    .post("/packages/list", {
      is_writable: true,
    })
    .then((r) => r.data.packages)

  // Autocomplete prompts with all packages, first option is "Enter Manually"
  const { selectedPackage } = await prompts({
    type: "autocomplete",
    name: "selectedPackage",
    message: "Select a package",
    choices: [
      {
        title: "Enter Manually",
        value: null,
      },
      ...myPackages.map((p) => ({
        title: p.name,
        value: p.name,
      })),
    ],
  })

  if (selectedPackage === "Enter Manually") {
    const { packageName } = await prompts({
      type: "text",
      name: "packageName",
      message: "Enter the package name",
    })

    return packageName
  }

  // TODO cache recently selected packages

  return selectedPackage
}
