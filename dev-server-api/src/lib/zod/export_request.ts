import { z } from "zod"
import { export_parameters } from "./export_parameters"

export const export_request = z.object({
  export_request_id: z.coerce.number(),
  is_complete: z.boolean(),
  created_at: z.string(),
  export_name: z.string(),
  example_file_path: z.string(),
  export_parameters,
  file_summary: z
    .array(
      z.object({
        file_name: z.string(),
        export_file_id: z.number().int(),
      })
    )
    .optional(),
})

export type ExportRequest = z.infer<typeof export_request>
