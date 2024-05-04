import { withEdgeSpec } from "src/with-edge-spec"
import { NotFoundError } from "edgespec/middleware"
import { z } from "zod"

export default withEdgeSpec({
  methods: ["GET", "POST"],
  commonParams: z.object({
    dev_package_example_id: z.coerce.number(),
  }),
  jsonResponse: z.object({
    dev_package_example: z.object({
      dev_package_example_id: z.coerce.number(),
      file_path: z.string(),
      tscircuit_soup: z.any(),
      completed_edit_events: z.array(z.any()).nullable().default(null),
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
      last_updated_at: z.string().datetime(),
    }),
  }),
  auth: "none",
})(async (req, ctx) => {
  return ctx.json({
    dev_package_example: await ctx.db
      .selectFrom("dev_package_example")
      .selectAll()
      .where(
        "dev_package_example_id",
        "=",
        req.commonParams.dev_package_example_id
      )
      .executeTakeFirstOrThrow((e) => {
        throw new NotFoundError("Package not found")
      })
      .then((r) => ({
        ...r,
        is_loading: r.is_loading === 1,
        tscircuit_soup: JSON.parse(r.tscircuit_soup),
        completed_edit_events: r.completed_edit_events
          ? JSON.parse(r.completed_edit_events)
          : null,
      })),
  })
})
