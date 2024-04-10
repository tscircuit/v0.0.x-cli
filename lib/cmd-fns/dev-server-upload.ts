import { AppContext } from "../util/app-context"
import { z } from "zod"
import { getDevServerAxios } from "./dev/get-dev-server-axios"
import { uploadExamplesFromDirectory } from "./dev/upload-examples-from-directory"
import { startFsWatcher } from "./dev/start-fs-watcher"
import kleur from "kleur"
import { AxiosInstance } from "axios"

export const devServerUpload = async (ctx: AppContext, args: any) => {
  const params = z
    .object({
      dir: z.string().optional().default(ctx.cwd),
      port: z.coerce.number().optional().nullable().default(null),
      watch: z.boolean().optional().default(false),
    })
    .parse(args)

  let serverUrl = `http://localhost:${params.port ?? 3020}`
  let devServerAxios = getDevServerAxios({ serverUrl })

  const checkHealth = () =>
    devServerAxios
      .get("/api/health")
      .then(() => true)
      .catch((e) => false)

  let is_dev_server_healthy = await checkHealth()

  if (!is_dev_server_healthy && !params.port) {
    // attempt to use development-mode port, e.g. if someone ran
    // npm run start:dev-server:dev
    const devModeServerUrl = "http://localhost:3021"
    devServerAxios = getDevServerAxios({ serverUrl: devModeServerUrl })
    is_dev_server_healthy = await checkHealth()
    if (is_dev_server_healthy) serverUrl = devModeServerUrl
  }

  if (!is_dev_server_healthy) {
    console.log(
      kleur.red(
        `Dev server doesn't seem to be running at ${serverUrl}. (Could not ping health)`
      )
    )
    process.exit(1)
  }

  console.log(`Loading examples...`)
  await uploadExamplesFromDirectory({ devServerAxios, cwd: params.dir }, ctx)

  if (params.watch) {
    // Start watcher
    const watcher = await startFsWatcher(
      { cwd: params.dir, devServerAxios },
      ctx
    )
  }
}
