import { AxiosInstance } from "axios"
import kleur from "kleur"
import { fulfillExportRequests } from "./fulfill-export-requests"
import { AppContext } from "lib/util/app-context"

export const startExportRequestWatcher = async (
  {
    devServerAxios,
  }: {
    devServerAxios: AxiosInstance
  },
  ctx: AppContext
) => {
  let running = true

  ;(async () => {
    while (running) {
      try {
        await fulfillExportRequests({ dev_server_axios: devServerAxios }, ctx)
      } catch (err: any) {
        console.log(
          kleur.red(`Error in export request watcher: ${err.toString()}`)
        )
      }
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  })()

  return {
    stop: () => {
      running = false
    },
  }
}
