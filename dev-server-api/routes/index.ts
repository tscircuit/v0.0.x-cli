import { withWinterSpec } from "../src/with-winter-spec"
import { z } from "zod"

export default withWinterSpec({
  methods: ["GET"],
  auth: "none",
})(async (req, ctx) => {
  return new Response(
    `<html><body>This is the dev server API <a href="/api/db/download">view database</a></body></html>`,
    {
      headers: {
        "content-type": "text/html",
      },
    }
  )
})
