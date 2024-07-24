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
import { createConfigHandler } from "lib/create-config-manager"
import dargs from "dargs"
import { versionCmd } from "lib/cmd-fns/version"

export type CliArgs = {
  cmd: string[]
  yes?: boolean
  help?: boolean
}

export const createContextAndRunProgram = async (process_args: any) => {
  const args = minimist(process_args)

  const { global_config, profile_config, current_profile } =
    createConfigHandler({
      profile: args.profile,
    })

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

  // https://github.com/oven-sh/bun/issues/267
  axios.defaults.headers.common["Accept-Encoding"] = "gzip"

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
          }`,
        ),
      )
      return res
    })
  }

  axios.interceptors.response.use(
    (res) => res,
    (err) => {
      // ---- IGNORE LOGGING *_not_found --------
      if (
        err.config.data?.error?.error_code === "package_not_found" ||
        err.config.data?.error?.error_code === "package_release_not_found"
      ) {
        return Promise.reject(err)
      }
      // end ignores ---

      if (err.response?.status === 401) {
        console.log(
          kleur.red(
            "Authentication failed. Please run 'tsci login' to authenticate yourself.",
          ),
        )
        process.exit(1)
      }

      console.log(
        kleur.red(
          `[ERR] ${err.response?.status} ${err.config.method?.toUpperCase()} ${
            err.config.url
          }\n\n${JSON.stringify(err.response?.data, null, "  ")}`
            .replace(/\\n/g, "\n")
            .replace(/\\"/g, '"'),
        ),
      )
      console.log(kleur.yellow("[Request Body]:"), err.config.data)
      return Promise.reject(err)
    },
  )

  const ctx: AppContext = {
    cmd: args._,
    cwd: args.cwd ?? process.cwd(),
    current_profile,
    registry_url,
    axios,
    global_config,
    profile_config,
    runtime: global_config.get("runtime") ?? "node",
    args: {
      cmd: args._,
      yes: args.y ?? args.yes,
      help: undefined,
    },
    params: args,
  }

  delete args["cwd"]

  const { _: positional, ...flagsAndParams } = args
  const args_without_globals = positional.concat(dargs(flagsAndParams))

  if (args["version"] && args._.length === 2) {
    await versionCmd(ctx, {})
    process.exit(0)
  }

  // HACK: Fixes issue with tsci version --show-latest
  if (args_without_globals.includes("--show_latest")) {
    args_without_globals[args_without_globals.indexOf("--show_latest")] =
      "--show-latest"
  }

  await perfectCli(getProgram(ctx), args_without_globals, {
    async customParamHandler({ commandPath, optionName }, { prompts }) {
      let optionNameHandler =
        PARAM_HANDLERS_BY_PARAM_NAME[_.snakeCase(optionName)]

      if (
        commandPath.join(" ") === "config set-registry" &&
        optionName === "server"
      ) {
        optionNameHandler = PARAM_HANDLERS_BY_PARAM_NAME["registry_url"]
      }

      if (optionNameHandler) {
        return optionNameHandler({ prompts, ctx })
      }
    },
  })

  return ctx
}
