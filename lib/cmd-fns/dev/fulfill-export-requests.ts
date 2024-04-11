import { AppContext } from "../../util/app-context"
import kleur from "kleur"
import { exportGerbersToZipBuffer } from "lib/export-gerbers"
import { AxiosInstance } from "axios"

export const fulfillExportRequests = async (
  {
    dev_server_axios,
  }: {
    dev_server_axios: AxiosInstance
  },
  ctx: AppContext
) => {
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
