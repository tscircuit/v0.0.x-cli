import { interactForPackageReleaseId } from "./interact-for-package-release-id"
import { ParamHandler } from "./param-handler-type"

export const interactForRegistryUrl: ParamHandler = async (params) => {
  const { prompts, ctx } = params

  const { registry_url } = await prompts({
    type: "select",
    name: "registry_url",
    message: "Select a package example",
    choices: [
      "https://registry.tscircuit.com",
      "http://localhost:3100",
      "other",
    ].map((a) => ({ title: a, value: a })),
  })

  if (registry_url === "other") {
    const { registry_url } = await prompts({
      type: "text",
      name: "registry_url",
      message: "Enter the registry url",
    })
    return registry_url
  }

  return registry_url
}
