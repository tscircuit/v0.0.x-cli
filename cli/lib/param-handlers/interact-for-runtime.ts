import kleur from "kleur"
import { ParamHandler } from "./param-handler-type"
import $ from "dax-sh"

export const interactForRuntime: ParamHandler = async (params) => {
  const { prompts, ctx } = params

  const bunVersion = await $`bun --version`.text().catch((e) => null)

  if (!bunVersion) {
    console.log(
      kleur.red(`BUN IS NOT INSTALLED! Install bun first https://bun.sh/`),
    )
  }

  const { runtime } = await prompts({
    type: "select",
    name: "runtime",
    message: "Select a runtime",
    choices: [
      {
        title: "bun",
        value: "bun",
        description: bunVersion
          ? `bun version: ${bunVersion}`
          : "NOTE: bun not installed, install bun first!",
      },
      { title: "node", value: "node" },
    ],
  })

  return runtime
}
