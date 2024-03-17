import { createWithEdgeSpec } from "edgespec"
import { withDb } from "./middlewares/with-db"
import { withErrorResponse } from "./middlewares/with-error-response"

export const withEdgeSpec = createWithEdgeSpec({
  authMiddleware: {},
  beforeAuthMiddleware: [withErrorResponse, withDb],
})
