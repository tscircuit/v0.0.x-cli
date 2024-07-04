import { withWinterSpec } from "src/with-winter-spec"
import { z } from "zod"
import { export_request } from "src/lib/zod/export_request"
import { publicMapExportRequest } from "src/lib/public-mapping/public-map-export-request"

export default withWinterSpec({
  methods: ["GET", "POST"],
  commonParams: z.object({
    is_complete: z.boolean().nullable().default(null),
  }),
  jsonResponse: z.object({
    export_requests: z.array(export_request),
  }),
  auth: "none",
})(async (req, ctx) => {
  const { is_complete } = req.commonParams
  const db_export_requests = await ctx.db
    .selectFrom("export_request")
    .selectAll()
    .$if(is_complete !== null, (q) =>
      q.where("export_request.is_complete", "=", is_complete ? 1 : 0)
    )
    .execute()

  return ctx.json({
    export_requests: db_export_requests.map((er) => publicMapExportRequest(er)),
  })
})
