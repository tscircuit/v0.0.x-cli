import Configstore from "configstore"
import { AppContext } from "./app-context"
import minimist from "minimist"
import _ from "lodash"
import prompts from "prompts"
import { perfectCli } from "perfect-cli"
import { getProgram } from "../get-program"
import defaultAxios from "axios"
import kleur from "kleur"
import { PARAM_HANDLERS_BY_PARAM_NAME } from "lib/param-handlers"

export type CliArgs = {
  cmd: string[]
  yes?: boolean
  help?: boolean
}

export const createContextAndRunProgram = async (process_args: any) => {
  const args = minimist(process_args)

  const global_config = new Configstore("tsci")
  const current_profile =
    args.profile ?? global_config.get("current_profile") ?? "default"
  const profile_config: typeof global_config = {
    get: (key: string) =>
      global_config.get(`profiles.${current_profile}.${key}`),
    set: (key: string, value: any) =>
      global_config.set(`profiles.${current_profile}.${key}`, value),
  } as any

  // Load registry commands
  const registry_url =
    profile_config.get("registry_url") ?? "https://registry-api.tscircuit.com"

  // TODO don't replace non-command args with underscores
  args._ = args._.map((p: string) => p.toLowerCase().replace(/-/g, "_"))

  // If flags are provided with dashes, switch them to underscores
  for (const key in args) {
    if (key.includes("-")) {
      args[key.replace(/-/g, "_")] = args[key]
      delete args[key]
    }
  }

  const axios = defaultAxios.create({
    baseURL: registry_url,
    headers: {
      Authorization: `Bearer ${profile_config.get("session_token")}`,
    },
  })

  if (global_config.get("log_requests")) {
    console.log(`Using registry_url: ${registry_url}`)
    axios.interceptors.request.use((req) => {
      console.log(kleur.grey(`[REQ] ${req.method?.toUpperCase()} ${req.url}`))
      return req
    })
    axios.interceptors.response.use((res) => {
      console.log(
        kleur.grey(
          `[RES] ${res.status} ${res.config.method?.toUpperCase()} ${
            res.config.url
          }`
        )
      )
      return res
    })
  }

  axios.interceptors.response.use(
    (res) => res,
    (err) => {
      console.log(
        kleur.red(
          `[ERR] ${err.response?.status} ${err.config.method?.toUpperCase()} ${
            err.config.url
          }\n\n${JSON.stringify(err.response?.data, null, "  ")}`
            .replace(/\\n/g, "\n")
            .replace(/\\"/g, '"')
        )
      )
      console.log(kleur.yellow("[Request Body]:"), err.config.data)
      return Promise.reject(err)
    }
  )

  const ctx: AppContext = {
    cmd: args._,
    cwd: args.cwd ?? process.cwd(),
    profile: current_profile,
    registry_url,
    axios,
    global_config,
    profile_config,
    args: {
      cmd: args._,
      yes: args.y ?? args.yes,
      help: undefined,
    },
    params: args,
  }

  await perfectCli(getProgram(ctx), process.argv, {
    async customParamHandler({ commandPath, optionName }, { prompts }) {
      const optionNameHandler =
        PARAM_HANDLERS_BY_PARAM_NAME[_.snakeCase(optionName)]

      if (optionNameHandler) {
        return optionNameHandler({ prompts, ctx })
      }
    },
  })

  return ctx
}
