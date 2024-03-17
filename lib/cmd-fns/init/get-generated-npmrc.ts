import { AppContext } from "lib/util/app-context"

export const getGeneratedNpmrc = (ctx: AppContext) =>
  `

@tsci:registry=${ctx.registry_url}/npm

`.trim()
