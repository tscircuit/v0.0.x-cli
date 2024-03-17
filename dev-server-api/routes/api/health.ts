import { withEdgeSpec } from "../../src/with-edge-spec"
import { z } from "zod"

export default withEdgeSpec({
  methods: ["GET", "POST"],
  jsonResponse: z.object({
    ok: z.boolean(),
  }),
})(async (req, ctx) => {
  return ctx.json({ ok: true })
})
