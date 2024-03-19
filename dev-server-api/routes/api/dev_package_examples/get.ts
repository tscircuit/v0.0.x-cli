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
      error: z.string().nullable().optional().default(null),
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
        tscircuit_soup: JSON.parse(r.tscircuit_soup),
      })),
  })
})
