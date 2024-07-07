import { withWinterSpec } from "src/with-winter-spec"
import { z } from "zod"

export default withWinterSpec({
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
      last_updated_at: z.string().datetime().nullable(), // TODO remove nullable
    }),
  }),
  auth: "none",
})(async (req, ctx) => {
  const tscircuit_soup = req.jsonBody.tscircuit_soup

  const existingDevPackageExample = await ctx.db.find("dev_package_example", {
    file_path: req.jsonBody.file_path,
  })

  const dev_package_example = await ctx.db.put("dev_package_example", {
    dev_package_example_id: existingDevPackageExample?.dev_package_example_id,
    file_path: req.jsonBody.file_path,
    export_name: req.jsonBody.export_name,
    error: req.jsonBody.error,
    tscircuit_soup,
    is_loading: Boolean(req.jsonBody.is_loading),
    last_updated_at: new Date().toISOString(),
  })

  return ctx.json({
    dev_package_example,
  })
})
