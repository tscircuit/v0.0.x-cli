import { withEdgeSpec } from "src/with-edge-spec"
import { NotFoundError } from "edgespec/middleware"
import { z } from "zod"

export default withEdgeSpec({
  methods: ["POST"],
  jsonBody: z.object({
    dev_package_example_id: z.coerce.number(),
    tscircuit_soup: z.any().optional(),
    completed_edit_events: z.array(z.any()).optional(),
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
        last_updated_at: new Date().toISOString(),
      })
      .$if(req.jsonBody.tscircuit_soup !== undefined, (q) =>
        q.set("tscircuit_soup", req.jsonBody.tscircuit_soup).set("error", null)
      )
      .$if(req.jsonBody.error !== undefined, (q) =>
        q.set("error", req.jsonBody.error)
      )
      .$if(req.jsonBody.completed_edit_events !== undefined, (q) =>
        q.set("completed_edit_events", req.jsonBody.completed_edit_events)
      )
      .returningAll()
      .where("dev_package_example_id", "=", req.jsonBody.dev_package_example_id)
      .executeTakeFirstOrThrow(),
  })
})
