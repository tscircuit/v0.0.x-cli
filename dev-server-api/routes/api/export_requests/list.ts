import { withWinterSpec } from "src/with-winter-spec"
import { z } from "zod"
import { publicMapExportRequest } from "src/lib/public-mapping/public-map-export-request"
import { ExportRequestSchema } from "src/db/schema"

export default withWinterSpec({
  methods: ["GET", "POST"],
  commonParams: z.object({
    is_complete: z.boolean().nullable().default(null),
  }),
  jsonResponse: z.object({
    export_requests: z.array(ExportRequestSchema),
  }),
  auth: "none",
})(async (req, ctx) => {
  const { is_complete } = req.commonParams
  const db_export_requests = await ctx.db.list("export_request")

  const filtered_requests =
    is_complete === null
      ? db_export_requests
      : db_export_requests.filter((er) => er.is_complete === is_complete)

  return ctx.json({
    export_requests: filtered_requests,
  })
})
