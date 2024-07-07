import { publicMapExportFile } from "src/lib/public-mapping/public-map-export-file"
import { export_file } from "src/lib/zod/export_file"
import { withWinterSpec } from "src/with-winter-spec"
import { NotFoundError } from "winterspec/middleware"
import { z } from "zod"

export default withWinterSpec({
  methods: ["GET"],
  queryParams: z.object({
    export_file_id: z.coerce.number().int(),
  }),
  auth: "none",
})(async (req, ctx) => {
  const export_file = await ctx.db.get("export_file", req.query.export_file_id)

  if (!export_file) {
    throw new NotFoundError("Export file not found")
  }

  const file_content = Buffer.from(export_file.file_content_base64!, "base64")

  return new Response(file_content, {
    headers: {
      "Content-Disposition": `attachment; filename="${export_file.file_name}"`,
    },
  })
})
