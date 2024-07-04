import { sql } from "kysely"
import { withWinterSpec } from "src/with-winter-spec"
import { z } from "zod"

export default withWinterSpec({
  methods: ["GET", "POST"],
  jsonResponse: z.object({
    dev_package_examples: z.array(
      z.object({
        dev_package_example_id: z.coerce.number(),
        file_path: z.string(),
        export_name: z.string(),
        is_loading: z.coerce.boolean(),
        edit_events_last_updated_at: z
          .string()
          .datetime()
          .nullable()
          .default(null),
        soup_last_updated_at: z.string().datetime().nullable().default(null),
        last_updated_at: z.string().datetime(),
      })
    ),
  }),
  auth: "none",
})(async (req, ctx) => {
  const dev_package_examples = await ctx.db
    .selectFrom("dev_package_example")
    .select([
      "dev_package_example_id",
      "file_path",
      "export_name",
      "last_updated_at",
      "edit_events_last_updated_at",
      "soup_last_updated_at",
      sql`(is_loading = 1)`.$castTo<boolean>().as("is_loading"),
    ])
    .execute()
  return ctx.json({
    dev_package_examples,
  })
})
