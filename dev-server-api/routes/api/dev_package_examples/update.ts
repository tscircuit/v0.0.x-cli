import { withEdgeSpec } from "src/with-edge-spec"
import { NotFoundError } from "edgespec/middleware"
import { z } from "zod"

export default withEdgeSpec({
  methods: ["POST"],
  jsonBody: z.object({
    dev_package_example_id: z.coerce.number(),
    tscircuit_soup: z.any(),
  }),
  jsonResponse: z.object({
    dev_package_example: z.object({
      dev_package_example_id: z.coerce.number(),
      tscircuit_soup: z.any(),
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
        last_updated_at: new Date().toISOString(),
      })
      .returningAll()
      .where("dev_package_example_id", "=", req.jsonBody.dev_package_example_id)
      .executeTakeFirstOrThrow(),
  })
})
