// @ts-nocheck
import { withWinterSpec } from "../src/with-winter-spec"
import { z } from "zod"

export default withWinterSpec({
  methods: ["GET", "POST"],
  jsonResponse: z.object({
    ok: z.boolean(),
  }),
})(async (req, ctx) => {
  return ctx.json({ ok: true })
})
