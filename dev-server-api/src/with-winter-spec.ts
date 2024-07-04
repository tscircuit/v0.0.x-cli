import { createWithWinterSpec } from "winterspec"
import { withDb } from "./middlewares/with-db"
import { withErrorResponse } from "./middlewares/with-error-response"

export const withWinterSpec = createWithWinterSpec({
  authMiddleware: {},
  beforeAuthMiddleware: [withErrorResponse, withDb],
})
