import { withWinterSpec } from "src/with-winter-spec"
import { z } from "zod"
import { export_request } from "src/lib/zod/export_request"
import { publicMapExportRequest } from "src/lib/public-mapping/public-map-export-request"

export default withWinterSpec({
  methods: ["GET", "POST"],
  commonParams: z.object({
    export_request_id: z.coerce.number(),
  }),
  jsonResponse: z.object({
    export_request: export_request,
  }),
  auth: "none",
})(async (req, ctx) => {
  const { export_request_id } = req.commonParams
  const db_export_request: any = await ctx.db
    .selectFrom("export_request")
    .selectAll()
    .where("export_request_id", "=", export_request_id)
    .executeTakeFirstOrThrow()

  db_export_request.file_summary = (
    await ctx.db
      .selectFrom("export_file")
      .where("export_request_id", "=", export_request_id)
      .selectAll()
      .execute()
  ).map((ef) => ({
    file_name: ef.file_name,
    export_file_id: ef.export_file_id,
  }))

  return ctx.json({
    export_request: publicMapExportRequest(db_export_request),
  })
})
