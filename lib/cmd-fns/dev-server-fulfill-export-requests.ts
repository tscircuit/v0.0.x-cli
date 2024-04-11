import { AppContext } from "../util/app-context"
import { z } from "zod"
import { getDevServerAxios } from "./dev/get-dev-server-axios"
import { uploadExamplesFromDirectory } from "./dev/upload-examples-from-directory"
import { startFsWatcher } from "./dev/start-fs-watcher"
import kleur from "kleur"
import { exportGerbersToZipBuffer } from "lib/export-gerbers"

export const devServerFulfillExportRequests = async (
  ctx: AppContext,
  args: any
) => {
  const params = z.object({}).parse(args)

  let server_url = `http://localhost:3020`
  let dev_server_axios = getDevServerAxios({ serverUrl: server_url })

  const checkHealth = () =>
    dev_server_axios
      .get("/api/health")
      .then(() => true)
      .catch((e) => false)

  let is_dev_server_healthy = await checkHealth()

  if (!is_dev_server_healthy) {
    // attempt to use development-mode port, e.g. if someone ran
    // npm run start:dev-server:dev
    const devModeServerUrl = "http://localhost:3021"
    dev_server_axios = getDevServerAxios({ serverUrl: devModeServerUrl })
    is_dev_server_healthy = await checkHealth()
    if (is_dev_server_healthy) server_url = devModeServerUrl
  }

  if (!is_dev_server_healthy) {
    console.log(
      kleur.red(
        `Dev server doesn't seem to be running at ${server_url}. (Could not ping health)`
      )
    )
    process.exit(1)
  }

  console.log("Getting export requests...")
  const export_requests = await dev_server_axios
    .post("/api/export_requests/list", {
      is_complete: false,
    })
    .then((r) => r.data.export_requests)

  for (const export_request of export_requests) {
    console.log(kleur.gray(`Fulfilling export request ${export_request.id}`))
    console.log(
      kleur.gray(`  example_file_path: ${export_request.example_file_path}`)
    )

    console.log(kleur.gray(`\n  exporting gerbers...`))
    const zip_buffer = await exportGerbersToZipBuffer(
      {
        example_file_path: export_request.example_file_path,
        export_name: export_request.export_name,
      },
      ctx
    )

    console.log(
      kleur.gray(
        `  uploading zip "${export_request.export_parameters.gerbers_zip_file_name}" to dev server...`
      )
    )

    await dev_server_axios.post("/api/export_files/create", {
      file_content_base64: zip_buffer.toString("base64"),
      file_name: export_request.export_parameters.gerbers_zip_file_name,
      export_request_id: export_request.export_request_id,
    })

    console.log(kleur.gray(`  marking export request as complete...`))

    await dev_server_axios.post("/api/export_requests/update", {
      export_request_id: export_request.export_request_id,
      is_complete: true,
    })

    console.log(kleur.green(`  done`))
  }
}
