import { withWinterSpec } from "api/lib/with-winter-spec"

export default withWinterSpec({
  methods: ["GET", "POST"],
  auth: "none",
})(async (req, ctx) => {
  await ctx.db.clear()
  return new Response(JSON.stringify({}), {
    headers: {
      "content-type": "application/json",
    },
  })
})
