import { withEdgeSpec } from "src/with-edge-spec"
import { z } from "zod"

export default withEdgeSpec({
  methods: ["GET", "POST"],
  jsonResponse: z.object({
    dev_package_examples: z.array(
      z.object({
        dev_package_example_id: z.coerce.number(),
        file_path: z.string(),
        export_name: z.string(),
        last_updated_at: z.string().datetime(),
      })
    ),
  }),
  auth: "none",
})(async (req, ctx) => {
  return ctx.json({
    dev_package_examples: await ctx.db
      .selectFrom("dev_package_example")
      .select([
        "dev_package_example_id",
        "file_path",
        "export_name",
        "last_updated_at",
      ])
      .execute(),
  })
})
