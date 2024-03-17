import { AppContext } from "../util/app-context"
import { z } from "zod"
import { getDevServerAxios } from "./dev/get-dev-server-axios"
import { uploadExamplesFromDirectory } from "./dev/upload-examples-from-directory"
import { startWatcher } from "./dev/start-watcher"

export const devServerUpload = async (ctx: AppContext, args: any) => {
  const params = z
    .object({
      dir: z.string().optional().default(ctx.cwd),
      port: z.coerce.number().optional().default(3020),
      watch: z.boolean().optional().default(false),
    })
    .parse(args)

  const serverUrl = `http://localhost:${params.port}`
  const devServerAxios = getDevServerAxios({ serverUrl })

  console.log(`Loading examples...`)
  await uploadExamplesFromDirectory({ devServerAxios, cwd: params.dir })

  if (params.watch) {
    // Start watcher
    const watcher = await startWatcher({ cwd: params.dir, devServerAxios })
  }
}
