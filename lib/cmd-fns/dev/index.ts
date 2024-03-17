import { AppContext } from "../../util/app-context"
import { z } from "zod"
import kleur from "kleur"
import prompts from "prompts"
import open from "open"
import { startDevServer } from "./start-dev-server"
import { getDevServerAxios } from "./get-dev-server-axios"
import { uploadExamplesFromDirectory } from "./upload-examples-from-directory"
import { unlink } from "fs/promises"
import * as Path from "path"
import { appendFileSync, existsSync, readFileSync } from "fs"
import { startWatcher } from "./start-watcher"
import { createOrModifyNpmrc } from "../init/create-or-modify-npmrc"

export const checkIfInitialized = async (ctx: AppContext) => {
  const packageJsonPath = Path.join(cwd, "package.json")
  if (!existsSync(packageJsonPath)) {
    console.error(kleur.red(`No package.json found`))
    return false
  }

  const packageJsonRaw = readFileSync(packageJsonPath, "utf-8")
  if (!packageJsonRaw.includes("tscircuit")) {
    console.error(
      kleur.red(`No tscircuit dependencies are installed in this project.`)
    )
    return false
  }

  return true
}

export const devCmd = async (ctx: AppContext, args: any) => {
  const params = z
    .object({
      cwd: z.string().optional().default(process.cwd()),
      port: z.coerce.number().optional().default(3020),
    })
    .parse(args)

  const { cwd, port } = params

  // In the future we should automatically run "tsci init" if the directory
  // isn't properly initialized, for now we're just going to do a spot check
  const isInitialized = await checkIfInitialized(ctx)

  if (!isInitialized) {
    console.log(
      kleur.red(
        `This project is not properly initialized. Please run "tsci init" first, or follow the manual installation steps here:\n\nhttps://github.com/tscircuit/tscircuit/blob/main/docs/manual-installation.md`
      )
    )
    process.exit(1)
  }

  await createOrModifyNpmrc({ quiet: false }, ctx)

  // Load package.json, install tscircuit if it's not installed. If any other
  // tscircuit dependency like @tscircuit/builder is installed, then don't
  // install anything. If there is nothing in the current directory, ask to
  // instead run "tsci init"
  // TODO

  // Add .tscircuit to .gitignore if it's not already there
  // TODO

  // Delete old .tscircuit/dev-server.db
  unlink(Path.join(cwd, ".tscircuit/dev-server.db")).catch(() => {})

  console.log(
    kleur.green(
      `\n--------------------------------------------\n\nStarting dev server http://localhost:${port}\n\n--------------------------------------------\n\n`
    )
  )
  const serverUrl = `http://localhost:${port}`
  const devServerAxios = getDevServerAxios({ serverUrl })

  const server = await startDevServer({ port, devServerAxios })

  // Soupify all examples
  console.log(`Loading examples...`)
  await uploadExamplesFromDirectory({ devServerAxios, cwd })

  // Start watcher
  const watcher = await startWatcher({ cwd, devServerAxios })

  while (true) {
    const { action } = await prompts({
      type: "select",
      name: "action", // Add this line
      message: "Action:",
      choices: [
        {
          title: "Open in Browser",
          value: "open-in-browser",
        },
        {
          title: "Stop Server",
          value: "stop",
        },
      ],
    })
    if (action === "open-in-browser") {
      open(serverUrl)
    } else if (!action || action === "stop") {
      if (server.stop) server.stop()
      if (server.close) server.close()
      watcher.stop()
      break
    }
  }
}
