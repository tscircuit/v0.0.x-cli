import { withWinterSpec } from "src/with-winter-spec"
import { z } from "zod"

export default withWinterSpec({
  methods: ["POST"],
  jsonBody: z.object({
    package_name: z.string(),
  }),
  jsonResponse: z.object({
    package_info: z.object({
      name: z.string(),
    }),
  }),
  auth: "none",
})(async (req, ctx) => {
  const package_name = req.jsonBody.package_name

  const package_info = await ctx.db.put("package_info", {
    package_info_id: 1,
    name: package_name,
  })

  return ctx.json({
    package_info,
  })
})
