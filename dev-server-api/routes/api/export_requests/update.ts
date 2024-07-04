import { withWinterSpec } from "src/with-winter-spec"
import { NotFoundError } from "edgespec/middleware"
import { z } from "zod"
import { export_request } from "src/lib/zod/export_request"
import { publicMapExportRequest } from "src/lib/public-mapping/public-map-export-request"
import { export_parameters } from "src/lib/zod/export_parameters"

export default withWinterSpec({
  methods: ["POST"],
  jsonBody: z.object({
    export_request_id: z.coerce.number(),
    is_complete: z.boolean().optional(),
    has_error: z.boolean().optional(),
    error: z.string().optional(),
  }),
  jsonResponse: z.object({}),
  auth: "none",
})(async (req, ctx) => {
  await ctx.db
    .updateTable("export_request")
    .$if(req.jsonBody.is_complete !== undefined, (qb) =>
      qb.set({
        is_complete: req.jsonBody.is_complete ? 1 : 0,
      })
    )
    .$if(req.jsonBody.has_error !== undefined, (qb) =>
      qb.set({
        has_error: req.jsonBody.has_error ? 1 : 0,
        error: req.jsonBody.error,
      })
    )
    .where("export_request_id", "=", req.jsonBody.export_request_id)
    .execute()

  return ctx.json({})
})
