import type { ExportRequest } from "src/db/get-db"
import { export_file } from "src/lib/zod/export_file"
import { z } from "zod"

export const publicMapExportFile = (db_export_file: {
  export_file_id: number
  export_request_id: number
  file_name: string
  created_at: string
}): z.infer<typeof export_file> => {
  return {
    export_request_id: db_export_file.export_request_id as any,
    export_file_id: db_export_file.export_file_id as any,
    file_name: db_export_file.file_name,
    created_at: db_export_file.created_at,
  }
}
