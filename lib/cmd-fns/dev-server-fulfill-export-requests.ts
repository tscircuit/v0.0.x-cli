import { AppContext } from "../util/app-context"
import { z } from "zod"
import { getDevServerAxios } from "./dev/get-dev-server-axios"
import kleur from "kleur"
import { fulfillExportRequests } from "./dev/fulfill-export-requests"

export const devServerFulfillExportRequests = async (
  ctx: AppContext,
  args: any
) => {
  const params = z.object({}).parse(args)

  let server_url = `http://localhost:3020`
  let dev_server_axios = getDevServerAxios({ serverUrl: server_url })

  const checkHealth = () =>
    dev_server_axios
      .get("/api/health")
      .then(() => true)
      .catch((e) => false)

  let is_dev_server_healthy = await checkHealth()

  if (!is_dev_server_healthy) {
    // attempt to use development-mode port, e.g. if someone ran
    // npm run start:dev-server:dev
    const devModeServerUrl = "http://localhost:3021"
    dev_server_axios = getDevServerAxios({ serverUrl: devModeServerUrl })
    is_dev_server_healthy = await checkHealth()
    if (is_dev_server_healthy) server_url = devModeServerUrl
  }

  if (!is_dev_server_healthy) {
    console.log(
      kleur.red(
        `Dev server doesn't seem to be running at ${server_url}. (Could not ping health)`
      )
    )
    process.exit(1)
  }

  await fulfillExportRequests({ dev_server_axios }, ctx)
}
