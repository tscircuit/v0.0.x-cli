import { publicMapExportFile } from "src/lib/public-mapping/public-map-export-file"
import { export_file } from "src/lib/zod/export_file"
import { withWinterSpec } from "src/with-winter-spec"
import { z } from "zod"

export default withWinterSpec({
  methods: ["GET"],
  queryParams: z.object({
    export_file_id: z.coerce.number().int(),
  }),
  auth: "none",
})(async (req, ctx) => {
  const db_export_file = await ctx.db
    .selectFrom("export_file")
    .selectAll()
    .where("export_file_id", "=", req.query.export_file_id)
    .executeTakeFirstOrThrow()

  return new Response(db_export_file.file_content, {
    headers: {
      "Content-Disposition": `attachment; filename="${db_export_file.file_name}"`,
    },
  })
})
