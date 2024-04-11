import type { ExportRequest } from "src/db/get-db"
import { export_request } from "src/lib/zod/export_request"
import { z } from "zod"

export const publicMapExportRequest = (db_export_request: {
  export_request_id: number
  example_file_path: string
  export_parameters: string
  export_name: string
  is_complete: 1 | 0
  created_at: string
}): z.infer<typeof export_request> => {
  return {
    export_request_id: db_export_request.export_request_id as any,
    is_completed: db_export_request.is_complete === 1,
    created_at: db_export_request.created_at,
    file_summary: [],
  }
}
