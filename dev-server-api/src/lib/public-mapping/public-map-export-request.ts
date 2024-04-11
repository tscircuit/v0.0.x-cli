import type { ExportRequest } from "src/db/get-db"
import { export_request } from "src/lib/zod/export_request"
import { z } from "zod"

export const publicMapExportRequest = (db_export_request: {
  export_request_id: number
  example_file_path: string
  export_parameters: string
  export_name: string
  is_complete: 1 | 0
  file_summary?: Array<any>
  created_at: string
}): z.infer<typeof export_request> => {
  return {
    export_request_id: db_export_request.export_request_id as any,
    example_file_path: db_export_request.example_file_path,
    export_name: db_export_request.export_name,
    is_complete: db_export_request.is_complete === 1,
    export_parameters: JSON.parse(db_export_request.export_parameters),
    file_summary: db_export_request.file_summary,
    created_at: db_export_request.created_at,
  }
}
