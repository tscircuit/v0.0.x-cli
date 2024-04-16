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
      await fulfillExportRequests({ dev_server_axios: devServerAxios }, ctx)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  })()

  return {
    stop: () => {
      running = false
    },
  }
}
