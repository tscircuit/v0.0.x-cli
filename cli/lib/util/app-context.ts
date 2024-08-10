import { AxiosInstance } from "axios"
import Configstore from "configstore"
import { ContextConfigProps } from "cli/lib/create-config-manager"

export type AppContext = {
  args: any
  cwd: string
  cmd: string[]
  params: Record<string, any>
  registry_url: string
  axios: AxiosInstance
  current_profile: string
  runtime: "node" | "bun"
} & ContextConfigProps
