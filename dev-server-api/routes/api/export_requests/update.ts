import { withEdgeSpec } from "src/with-edge-spec"
import { NotFoundError } from "edgespec/middleware"
import { z } from "zod"
import { export_request } from "src/lib/zod/export_request"
import { publicMapExportRequest } from "src/lib/public-mapping/public-map-export-request"
import { export_parameters } from "src/lib/zod/export_parameters"

export default withEdgeSpec({
  methods: ["POST"],
  jsonBody: z.object({
    export_request_id: z.coerce.number(),
    is_complete: z.boolean(),
  }),
  jsonResponse: z.object({}),
  auth: "none",
})(async (req, ctx) => {
  await ctx.db
    .updateTable("export_request")
    .set({
      is_complete: req.jsonBody.is_complete ? 1 : 0,
    })
    .where("export_request_id", "=", req.jsonBody.export_request_id)
    .execute()

  return ctx.json({})
})
