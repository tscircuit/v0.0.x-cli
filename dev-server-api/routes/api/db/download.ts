import { withWinterSpec } from "src/with-winter-spec"
import { z } from "zod"

export default withWinterSpec({
  methods: ["GET"],
  jsonResponse: z.object({
    dev_server_database_dump: z.any(),
  }),
  auth: "none",
})(async (req, ctx) => {
  return new Response(
    JSON.stringify(
      {
        dev_server_database_dump: await ctx.db.dump(),
      },
      null,
      "  "
    ),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  )
})
