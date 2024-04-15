import { AppContext } from "../../util/app-context"
import kleur from "kleur"
import { exportGerbersToZipBuffer } from "lib/export-fns/export-gerbers"
import { AxiosInstance } from "axios"
import { ExportRequest } from "@server/lib/zod/export_request"
import { exportPnpCsvToBuffer } from "lib/export-fns/export-pnp-csv"
import { exportBomCsvToBuffer } from "lib/export-fns/export-bom-csv"

export const uploadBufferToExportFile = async ({
  dev_server_axios,
  file_buffer,
  file_name,
  export_request_id,
}: {
  dev_server_axios: AxiosInstance
  file_buffer: Buffer
  file_name: string
  export_request_id: number
}) => {
  await dev_server_axios.post("/api/export_files/create", {
    file_content_base64: file_buffer.toString("base64"),
    file_name: file_name,
    export_request_id: export_request_id,
  })

  console.log(kleur.gray(`  marking export request as complete...`))

  await dev_server_axios.post("/api/export_requests/update", {
    export_request_id: export_request_id,
    is_complete: true,
  })

  console.log(kleur.green(`  done`))
}

export const fulfillExportRequests = async (
  {
    dev_server_axios,
  }: {
    dev_server_axios: AxiosInstance
  },
  ctx: AppContext
) => {
  const export_requests: ExportRequest[] = await dev_server_axios
    .post("/api/export_requests/list", {
      is_complete: false,
    })
    .then((r) => r.data.export_requests)

  for (const export_request of export_requests) {
    console.log(
      kleur.gray(
        `Fulfilling export request ${export_request.export_request_id}`
      )
    )
    console.log(
      kleur.gray(`  example_file_path: ${export_request.example_file_path}`)
    )

    if (export_request.export_parameters.should_export_gerber_zip) {
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

      await uploadBufferToExportFile({
        dev_server_axios,
        file_buffer: zip_buffer,
        file_name: export_request.export_parameters.gerbers_zip_file_name!,
        export_request_id: export_request.export_request_id,
      })
    }

    if (export_request.export_parameters.should_export_pnp_csv) {
      console.log(kleur.gray(`\n  exporting pick'n'place...`))
      const csv_buffer = await exportPnpCsvToBuffer(
        {
          example_file_path: export_request.example_file_path,
          export_name: export_request.export_name,
        },
        ctx
      )

      await uploadBufferToExportFile({
        dev_server_axios,
        file_buffer: csv_buffer,
        file_name: export_request.export_parameters.pnp_csv_file_name!,
        export_request_id: export_request.export_request_id,
      })
    }

    if (export_request.export_parameters.should_export_bom_csv) {
      console.log(kleur.gray(`\n  exporting bill of materials...`))
      const csv_buffer = await exportBomCsvToBuffer(
        {
          example_file_path: export_request.example_file_path,
          export_name: export_request.export_name,
        },
        ctx
      )

      await uploadBufferToExportFile({
        dev_server_axios,
        file_buffer: csv_buffer,
        file_name: export_request.export_parameters.bom_csv_file_name!,
        export_request_id: export_request.export_request_id,
      })
    }
  }
}
