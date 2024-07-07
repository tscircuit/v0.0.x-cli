import { withWinterSpec } from "src/with-winter-spec"
import { z } from "zod"

export default withWinterSpec({
  methods: ["GET", "POST"],
  jsonResponse: z.object({
    dev_package_examples: z.array(
      z.object({
        dev_package_example_id: z.coerce.number(),
        file_path: z.string(),
        export_name: z.string().nullable(),
        is_loading: z.boolean(),
        edit_events_last_updated_at: z.string().datetime().nullable(),
        soup_last_updated_at: z.string().datetime().nullable(),
        last_updated_at: z.string().datetime().nullable(),
      })
    ),
  }),
  auth: "none",
})(async (req, ctx) => {
  const dev_package_examples = (await ctx.db.list("dev_package_example")).map(
    (dpe) => ({
      dev_package_example_id: dpe.dev_package_example_id,
      file_path: dpe.file_path,
      export_name: dpe.export_name,
      is_loading: dpe.is_loading,
      edit_events_last_updated_at: dpe.edit_events_last_updated_at,
      soup_last_updated_at: dpe.soup_last_updated_at,
      last_updated_at: dpe.last_updated_at,
    })
  )

  return ctx.json({
    dev_package_examples,
  })
})
