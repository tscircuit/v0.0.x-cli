import { z } from "zod"

export const export_request = z.object({
  export_request_id: z.coerce.number(),
  is_completed: z.boolean(),
  created_at: z.string(),
  file_summary: z.array(
    z.object({
      file_name: z.string(),
      is_complete: z.boolean(),
    })
  ),
})
