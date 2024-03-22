import { withEdgeSpec } from "src/with-edge-spec"
import { NotFoundError } from "edgespec/middleware"
import { z } from "zod"

export default withEdgeSpec({
  methods: ["POST"],
  jsonBody: z.object({
    file_path: z.string(),
    export_name: z.string().default("default"),
    tscircuit_soup: z.any(),
    error: z.string().nullable().optional().default(null),
    is_loading: z.boolean().optional(),
  }),
  jsonResponse: z.object({
    dev_package_example: z.object({
      dev_package_example_id: z.coerce.number(),
      file_path: z.string(),
      tscircuit_soup: z.any(),
      error: z.string().nullable().optional(),
      last_updated_at: z.string().datetime(),
    }),
  }),
  auth: "none",
})(async (req, ctx) => {
  const tscircuit_soup = req.jsonBody.tscircuit_soup
    ? JSON.stringify(req.jsonBody.tscircuit_soup)
    : undefined
  const dev_package_example = await ctx.db
    .insertInto("dev_package_example")
    .values({
      file_path: req.jsonBody.file_path,
      export_name: req.jsonBody.export_name,
      error: req.jsonBody.error,
      tscircuit_soup,
      is_loading: req.jsonBody.is_loading ? 1 : 0,
      last_updated_at: new Date().toISOString(),
    })
    .onConflict((oc) =>
      oc.columns(["file_path"]).doUpdateSet({
        export_name: req.jsonBody.export_name,
        error: req.jsonBody.error,
        tscircuit_soup,
        is_loading: req.jsonBody.is_loading ? 1 : 0,
        last_updated_at: new Date().toISOString(),
      })
    )
    .returningAll()
    .executeTakeFirstOrThrow()

  return ctx.json({
    dev_package_example,
  })
})
