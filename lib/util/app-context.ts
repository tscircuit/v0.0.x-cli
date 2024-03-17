import { AxiosInstance } from "axios"
import Configstore from "configstore"

export type AppContext = {
  args: any
  cwd: string
  cmd: string[]
  params: Record<string, any>
  registry_url: string
  axios: AxiosInstance
  profile: string
  profile_config: Configstore
  global_config: Configstore
}
