import { sql } from "kysely"
import { withWinterSpec } from "src/with-winter-spec"
import { z } from "zod"
import { unlinkSync } from "fs"
import { getDbFilePath } from "src/db/get-db"

export default (req: Request) => {
  unlinkSync(getDbFilePath())

  return new Response(JSON.stringify({}), {
    headers: {
      "content-type": "application/json",
    },
  })
}
