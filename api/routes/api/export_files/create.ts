import { ExportFileSchema } from "api/src/db/schema"
import { withWinterSpec } from "api/lib/with-winter-spec"
import { z } from "zod"

export default withWinterSpec({
  methods: ["POST"],
  jsonBody: z.object({
    export_request_id: z.number().int(),
    file_name: z.string(),
    file_content_base64: z.string(),
  }),
  jsonResponse: z.object({
    export_file: ExportFileSchema.omit({ file_content_base64: true }),
  }),
  auth: "none",
})(async (req, ctx) => {
  const export_file = await ctx.db.put("export_file", {
    export_request_id: req.jsonBody.export_request_id,
    file_name: req.jsonBody.file_name,
    file_content_base64: req.jsonBody.file_content_base64,
    created_at: new Date().toISOString(),
  })
  console.log("done putting file")
  return ctx.json({
    export_file,
  })
})
