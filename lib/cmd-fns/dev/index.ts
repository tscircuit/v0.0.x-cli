import $ from "dax-sh"
import fs from "fs"
import { unlink } from "fs/promises"
import kleur from "kleur"
import open from "open"
import * as Path from "path"
import prompts from "prompts"
import { z } from "zod"
import { AppContext } from "../../util/app-context"
import { initCmd } from "../init"
import { createOrModifyNpmrc } from "../init/create-or-modify-npmrc"
import { checkIfInitialized } from "./check-if-initialized"
import { getDevServerAxios } from "./get-dev-server-axios"
import { startDevServer } from "./start-dev-server"
import { startEditEventWatcher } from "./start-edit-event-watcher"
import { startExportRequestWatcher } from "./start-export-request-watcher"
import { startFsWatcher } from "./start-fs-watcher"
import { uploadExamplesFromDirectory } from "./upload-examples-from-directory"

export const devCmd = async (ctx: AppContext, args: any) => {
  const params = z
    .object({
      port: z.coerce.number().optional().default(3020),
    })
    .parse(args)

  const { port } = params
  const { cwd } = ctx

  // In the future we should automatically run "tsci init" if the directory
  // isn't properly initialized, for now we're just going to do a spot check
  const isInitialized = await checkIfInitialized(ctx)

  if (!isInitialized) {
    const { confirmInitialize } = await prompts({
      type: "confirm",
      name: "confirmInitialize",
      message: "Would you like to initialize this project now?",
      initial: true,
    })

    if (confirmInitialize) {
      return initCmd(ctx, {})
    } else {
      process.exit(1)
    }
  }

  await createOrModifyNpmrc({ quiet: false }, ctx)

  // Load package.json, install tscircuit if it's not installed. If any other
  // tscircuit dependency like @tscircuit/builder is installed, then don't
  // install anything. If there is nothing in the current directory, ask to
  // instead run "tsci init"
  // TODO

  // Add .tscircuit to .gitignore if it's not already there
  // TODO

  // Delete old .tscircuit/dev-server.sqlite
  // unlink(Path.join(cwd, ".tscircuit/dev-server.sqlite")).catch(() => { })

  console.log(
    kleur.green(
      `\n--------------------------------------------\n\nStarting dev server http://localhost:${port}\n\n--------------------------------------------\n\n`
    )
  )
  const serverUrl = `http://localhost:${port}`
  const devServerAxios = getDevServerAxios({ serverUrl })

  const server = await startDevServer({ port, devServerAxios })

  // Reset the database, allows migration to re-run
  await devServerAxios.post("/api/dev_server/reset").catch((e) => {
    console.log("Failed to reset database, continuing anyway...")
  })

  // Add package name to the package_info table
  const packageJsonPath = Path.resolve(cwd, "package.json")
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))
  const packageName = packageJson.name

  console.log(`Adding package info...`)
  await devServerAxios.post(
    "/api/package_info/create",
    {
      package_name: packageName,
    },
    ctx
  )

  // Soupify all examples
  console.log(`Loading examples...`)
  await uploadExamplesFromDirectory({ devServerAxios, cwd }, ctx)

  // Start watchers
  const fs_watcher = await startFsWatcher({ cwd, devServerAxios }, ctx)
  const er_watcher = await startExportRequestWatcher({ devServerAxios }, ctx)
  const ee_watcher = await startEditEventWatcher({ devServerAxios }, ctx)

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
          title: "Open Directory in VS Code",
          value: "open-in-vs-code",
        },
        {
          title: "Stop Server",
          value: "stop",
        },
      ],
    })
    if (action === "open-in-browser") {
      open(serverUrl)
    } else if (action === "open-in-vs-code") {
      await $`code ${cwd}`
    } else if (!action || action === "stop") {
      if (server.stop) server.stop()
      if (server.close) server.close()
      fs_watcher.stop()
      er_watcher.stop()
      ee_watcher.stop()
      break
    }
  }
}
