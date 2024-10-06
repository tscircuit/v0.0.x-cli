import { AxiosInstance } from "axios"
import { ContextConfigProps } from "cli/lib/create-config-manager"

export type AppContext = {
  args: {
    cmd: string[]
    yes: boolean
    help: boolean | undefined
  }
  cwd: string
  cmd: string[]
  params: Record<string, any>
  registry_url: string
  axios: AxiosInstance
  current_profile: string
  runtime: "node" | "bun"
} & ContextConfigProps
