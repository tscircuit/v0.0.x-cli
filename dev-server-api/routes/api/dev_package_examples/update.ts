import { withEdgeSpec } from "src/with-edge-spec"
import { NotFoundError } from "edgespec/middleware"
import { z } from "zod"

export default withEdgeSpec({
  methods: ["POST"],
  jsonBody: z.object({
    dev_package_example_id: z.coerce.number(),
    tscircuit_soup: z.any().optional(),
    error: z.string().nullable().optional().default(null),
  }),
  jsonResponse: z.object({
    dev_package_example: z.object({
      dev_package_example_id: z.coerce.number(),
      tscircuit_soup: z.any(),
      error: z.string().nullable().optional(),
      last_updated_at: z.string().datetime(),
    }),
  }),
  auth: "none",
})(async (req, ctx) => {
  return ctx.json({
    dev_package_example: await ctx.db
      .updateTable("dev_package_example")
      .set({
        tscircuit_soup: req.jsonBody.tscircuit_soup,
        error: req.jsonBody.error,
        last_updated_at: new Date().toISOString(),
      })
      .returningAll()
      .where("dev_package_example_id", "=", req.jsonBody.dev_package_example_id)
      .executeTakeFirstOrThrow(),
  })
})
