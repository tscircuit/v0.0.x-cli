import { withEdgeSpec } from "src/with-edge-spec"
import { NotFoundError } from "edgespec/middleware"
import { z } from "zod"
import { export_request } from "src/lib/zod/export_request"
import { publicMapExportRequest } from "src/lib/public-mapping/public-map-export-request"
import { export_parameters } from "../../../src/lib/zod/export_parameters"

export default withEdgeSpec({
  methods: ["POST"],
  jsonBody: z.object({
    example_file_path: z.string(),
    export_name: z.string().nullable().optional(),
    export_parameters: export_parameters,
  }),
  jsonResponse: z.object({
    export_request,
  }),
  auth: "none",
})(async (req, ctx) => {
  const db_export_request = await ctx.db
    .insertInto("export_request")
    .values({
      example_file_path: req.jsonBody.example_file_path,
      export_parameters: JSON.stringify(req.jsonBody.export_parameters),
      export_name: req.jsonBody.export_name ?? "default",
      is_complete: 0,
      created_at: new Date().toISOString(),
    })
    .returningAll()
    .executeTakeFirstOrThrow()

  return ctx.json({
    export_request: publicMapExportRequest(db_export_request),
  })
})
