import { withEdgeSpec } from "src/with-edge-spec"
import { NotFoundError } from "edgespec/middleware"
import { z } from "zod"

export default withEdgeSpec({
  methods: ["POST"],
  jsonBody: z.object({
    example_file_path: z.string(),
    export_name: z.string().nullable().optional(),
    export_parameters: z.object({
      should_export_gerber_zip: z.boolean().default(false),
      gerbers_zip_file_name: z
        .string()
        .nullable()
        .optional()
        .default("gerbers.zip"),
    }),
  }),
  jsonResponse: z.object({
    export_request: z.object({
      export_request_id: z.coerce.number(),
      created_at: z.string(),
      file_summary: z.array(
        z.object({
          file_name: z.string(),
          is_complete: z.boolean(),
        })
      ),
    }),
  }),
  auth: "none",
})(async (req, ctx) => {
  // const tscircuit_soup = req.jsonBody.tscircuit_soup
  //   ? JSON.stringify(req.jsonBody.tscircuit_soup)
  //   : undefined
  // const dev_package_example = await ctx.db
  //   .insertInto("dev_package_example")
  //   .values({
  //     file_path: req.jsonBody.file_path,
  //     export_name: req.jsonBody.export_name,
  //     error: req.jsonBody.error,
  //     tscircuit_soup,
  //     is_loading: req.jsonBody.is_loading ? 1 : 0,
  //     last_updated_at: new Date().toISOString(),
  //   })
  //   .onConflict((oc) =>
  //     oc.columns(["file_path"]).doUpdateSet({
  //       export_name: req.jsonBody.export_name,
  //       error: req.jsonBody.error,
  //       tscircuit_soup,
  //       is_loading: req.jsonBody.is_loading ? 1 : 0,
  //       last_updated_at: new Date().toISOString(),
  //     })
  //   )
  //   .returningAll()
  //   .executeTakeFirstOrThrow()

  const export_request = {
    export_request_id: 1,
    created_at: new Date().toISOString(),
    file_summary: [],
  }

  return ctx.json({
    export_request,
  })
})
