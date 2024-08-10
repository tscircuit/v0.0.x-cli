import { createWithWinterSpec } from "winterspec"
import { withDb } from "./middlewares/with-db"
import { withErrorResponse } from "./middlewares/with-error-response"
import { withDebugRequestLogging } from "./middlewares/with-debug-request-logging"

export const withWinterSpec = createWithWinterSpec({
  authMiddleware: {},
  beforeAuthMiddleware: [withDebugRequestLogging, withErrorResponse, withDb],
})
