import { PackageInfoSchema } from "src/db/schema"
import { withWinterSpec } from "src/with-winter-spec"
import { z } from "zod"

export default withWinterSpec({
  methods: ["GET"],
  jsonResponse: z.object({
    package_info: PackageInfoSchema,
  }),
  auth: "none",
})(async (req, ctx) => {
  const package_info = await ctx.db.get("package_info", 1)

  return ctx.json({ package_info: package_info! })
})
