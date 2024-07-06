import { withWinterSpec } from "src/with-winter-spec"
import { NotFoundError } from "edgespec/middleware"
import { z } from "zod"
import { DevPackageExampleSchema } from "src/db/schema"

export default withWinterSpec({
  methods: ["POST"],
  jsonBody: z.object({
    dev_package_example_id: z.coerce.number(),
    tscircuit_soup: z.any().optional(),
    completed_edit_events: z.array(z.any()).optional(),
    edit_events_last_applied_at: z.string().datetime().optional(),
    error: z.string().nullable().optional().default(null),
  }),
  jsonResponse: z.object({
    dev_package_example: DevPackageExampleSchema,
  }),
  auth: "none",
})(async (req, ctx) => {
  const dev_package_example = await ctx.db.get(
    "dev_package_example",
    req.jsonBody.dev_package_example_id
  )

  if (!dev_package_example) {
    throw new NotFoundError("Package not found")
  }

  const new_dev_package_example = {
    ...dev_package_example,
  }

  if (req.jsonBody.completed_edit_events !== undefined) {
    new_dev_package_example.completed_edit_events =
      req.jsonBody.completed_edit_events
    new_dev_package_example.edit_events_last_updated_at =
      new Date().toISOString()
  }
  if (req.jsonBody.edit_events_last_applied_at !== undefined) {
    new_dev_package_example.edit_events_last_applied_at =
      req.jsonBody.edit_events_last_applied_at
  }
  if (req.jsonBody.tscircuit_soup !== undefined) {
    new_dev_package_example.tscircuit_soup = req.jsonBody.tscircuit_soup
    new_dev_package_example.error = null
    new_dev_package_example.soup_last_updated_at = new Date().toISOString()
  }
  if (req.jsonBody.error !== undefined) {
    new_dev_package_example.error = req.jsonBody.error
  }

  new_dev_package_example.last_updated_at = new Date().toISOString()

  await ctx.db.put("dev_package_example", new_dev_package_example)

  return ctx.json({
    dev_package_example: new_dev_package_example,
  })
})
