import { ParamHandler } from "./param-handler-type"

export const interactForPackageNameWithVersion: ParamHandler = async ({
  prompts,
  ctx,
}) => {
  // Find all package names by this user
  const myPackages: Array<{ name: string; latest_version: string }> =
    await ctx.axios
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
      ...myPackages.flatMap((p) => [
        {
          title: `${p.name}@${p.latest_version}`,
          value: `${p.name}@${p.latest_version}`,
        },
        {
          title: `${p.name}@...`,
          value: `${p.name}@...`,
        },
      ]),
    ],
  })

  if (selectedPackage.endsWith("@...")) {
    // TODO Poll for all versions available

    const { version } = await prompts({
      type: "text",
      name: "version",
      message: "Enter the version",
    })

    return selectedPackage.replace("@...", `@${version}`)
  }

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
