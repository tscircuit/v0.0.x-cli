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
        is_loading: z.boolean(),
        edit_events_last_updated_at: z.string().datetime().nullable(),
        soup_last_updated_at: z.string().datetime().nullable(),
        last_updated_at: z.string().datetime(),
      })
    ),
  }),
  auth: "none",
})(async (req, ctx) => {
  const dev_package_examples = await ctx.db.dump()
    .then(dump => dump.dev_package_example || [])
    .then(examples => examples.map(example => ({
      dev_package_example_id: example.dev_package_example_id,
      file_path: example.file_path,
      export_name: example.export_name,
      is_loading: example.is_loading,
      edit_events_last_updated_at: example.edit_events_last_updated_at,
      soup_last_updated_at: example.soup_last_updated_at,
      last_updated_at: example.last_updated_at,
    })))

  return ctx.json({
    dev_package_examples,
  })
})
