import { export_package_info } from "src/lib/zod/export_package_info"
import { withWinterSpec } from "src/with-winter-spec"
import { z } from "zod"

export default withWinterSpec({
  methods: ["GET"],
  jsonResponse: z.object({
    package_info: export_package_info
  }),
  auth: "none",
})(async (req, ctx) => {
  console.log("in endpoint")
  const db_package_info_request: any = await ctx.db
    .selectFrom("package_info")
    .select("name")
    .execute()

  return ctx.json({
    package_info: db_package_info_request[0]
  })
})