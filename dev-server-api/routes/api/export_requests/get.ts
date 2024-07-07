import { withWinterSpec } from "src/with-winter-spec"
import { z } from "zod"
import { export_request } from "src/lib/zod/export_request"
import { publicMapExportRequest } from "src/lib/public-mapping/public-map-export-request"
import { NotFoundError } from "edgespec/middleware"
import { ExportRequestSchema } from "src/db/schema"
import { file } from "bun"

export default withWinterSpec({
  methods: ["GET", "POST"],
  commonParams: z.object({
    export_request_id: z.coerce.number(),
  }),
  jsonResponse: z.object({
    export_request: ExportRequestSchema.extend({
      file_summary: z.array(
        z.object({ file_name: z.string(), export_file_id: z.coerce.number() })
      ),
    }),
  }),
  auth: "none",
})(async (req, ctx) => {
  const { export_request_id } = req.commonParams
  const export_request = await ctx.db.get("export_request", export_request_id)

  if (!export_request) {
    throw new NotFoundError("Export request not found")
  }

  const ext_export_request: Parameters<typeof ctx.json>[0]["export_request"] = {
    ...export_request,
    file_summary: undefined as any,
  }

  const export_files = (await ctx.db.list("export_file")).filter(
    (ef) => ef.export_request_id === export_request_id
  )
  ext_export_request.file_summary = export_files.map((ef) => ({
    file_name: ef.file_name!,
    export_file_id: ef.export_file_id,
  }))

  return ctx.json({
    export_request: ext_export_request,
  })
})
