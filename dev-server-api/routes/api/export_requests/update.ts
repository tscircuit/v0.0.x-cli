import { withWinterSpec } from "src/with-winter-spec"
import { NotFoundError } from "edgespec/middleware"
import { z } from "zod"
import { export_request } from "src/lib/zod/export_request"
import { publicMapExportRequest } from "src/lib/public-mapping/public-map-export-request"
import { ExportRequestSchema } from "src/db/schema"

export default withWinterSpec({
  methods: ["POST"],
  jsonBody: z.object({
    export_request_id: z.coerce.number(),
    is_complete: z.boolean().optional(),
    has_error: z.boolean().optional(),
    error: z.string().optional(),
  }),
  jsonResponse: z.object({
    export_request: ExportRequestSchema,
  }),
  auth: "none",
})(async (req, ctx) => {
  const { export_request_id, ...updateData } = req.jsonBody
  const existingRequest = await ctx.db.get("export_request", export_request_id)

  if (!existingRequest) {
    throw new NotFoundError("Export request not found")
  }

  const updatedRequest = await ctx.db.put("export_request", {
    ...existingRequest,
    ...updateData,
  })

  return ctx.json({
    export_request: updatedRequest,
  })
})
