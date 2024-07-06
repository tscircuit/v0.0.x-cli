import { withWinterSpec } from "../src/with-winter-spec"
import { z } from "zod"
import staticRoutes from "../static-routes"

export default withWinterSpec({
  methods: ["GET"],
  auth: "none",
})(async (req, ctx) => {
  return new Response(
    `<html><body>This is the dev server API <a href="/api/db/download">view database</a><br/><br/>${Object.entries(
      staticRoutes
    )
      .map(
        ([routePath]) => `<div><a href="${routePath}">${routePath}</a></div>`
      )
      .join("")}</body></html>`,
    {
      headers: {
        "content-type": "text/html",
      },
    }
  )
})
