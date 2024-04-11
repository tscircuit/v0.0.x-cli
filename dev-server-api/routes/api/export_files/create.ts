import { publicMapExportFile } from "src/lib/public-mapping/public-map-export-file"
import { export_file } from "src/lib/zod/export_file"
import { withEdgeSpec } from "src/with-edge-spec"
import { z } from "zod"

export default withEdgeSpec({
  methods: ["POST"],
  jsonBody: z.object({
    export_request_id: z.number().int(),
    file_name: z.string(),
    file_content_base64: z.string().transform((a) => Buffer.from(a, "base64")),
  }),
  jsonResponse: z.object({
    export_file,
  }),
  auth: "none",
})(async (req, ctx) => {
  const db_export_file = await ctx.db
    .insertInto("export_file")
    .values({
      export_request_id: req.jsonBody.export_request_id,
      file_name: req.jsonBody.file_name,
      file_content: req.jsonBody.file_content_base64,
      created_at: new Date().toISOString(),
    })
    .returningAll()
    .executeTakeFirstOrThrow()

  return ctx.json({
    export_file: publicMapExportFile(db_export_file),
  })
})
