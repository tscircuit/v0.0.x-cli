import { withWinterSpec } from "src/with-winter-spec"
import { NotFoundError } from "edgespec/middleware"
import { z } from "zod"

export default withWinterSpec({
  methods: ["GET", "POST"],
  commonParams: z.object({
    dev_package_example_id: z.coerce.number(),
  }),
  jsonResponse: z.object({
    dev_package_example: z.object({
      dev_package_example_id: z.coerce.number(),
      file_path: z.string(),
      tscircuit_soup: z.any(),
      completed_edit_events: z.array(z.any()).default([]),
      is_loading: z.boolean(),
      error: z.string().nullable().optional().default(null),
      soup_last_updated_at: z.string().datetime().nullable().default(null),
      edit_events_last_updated_at: z
        .string()
        .datetime()
        .nullable()
        .default(null),
      edit_events_last_applied_at: z
        .string()
        .datetime()
        .nullable()
        .default(null),
      last_updated_at: z.string().datetime().nullable(),
    }),
  }),
  auth: "none",
})(async (req, ctx) => {
  const dev_package_example = await ctx.db.get(
    "dev_package_example",
    req.commonParams.dev_package_example_id
  )

  if (!dev_package_example) {
    throw new NotFoundError("Package not found")
  }

  return ctx.json({
    dev_package_example,
  })
})
