import { z } from "zod"

export const export_file = z.object({
  export_file_id: z.number().int(),
  export_request_id: z.number().int(),
  file_name: z.string(),
  created_at: z.string(),
})
