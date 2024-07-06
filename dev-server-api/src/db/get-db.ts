import { mkdirSync } from "fs"
import { Kysely, SqliteDialect, sql, type Generated } from "kysely"
import * as Path from "path"
import { createSchema } from "./create-schema"
import { ZodLevelDatabase } from "./zod-level-db"

export interface PackageInfo {
  name: string
}

export interface DevPackageExample {
  dev_package_example_id: Generated<number>
  tscircuit_soup: any
  completed_edit_events: any
  file_path: string
  export_name: string
  error: string | null
  is_loading: 1 | 0
  last_updated_at: string
  soup_last_updated_at: string
  edit_events_last_updated_at: string
  edit_events_last_applied_at: string
}

export interface ExportRequest {
  export_request_id: Generated<number>
  example_file_path: string
  export_parameters: string
  export_name: string
  is_complete: 1 | 0
  has_error: 1 | 0
  error?: string
  created_at: string
}

export interface ExportFile {
  export_file_id: Generated<number>
  file_name: string
  file_content: Buffer
  export_request_id: number
  created_at: string
}

interface KyselyDatabaseSchema {
  dev_package_example: DevPackageExample
  export_request: ExportRequest
  export_file: ExportFile
  package_info: PackageInfo
}

export type DbClient = Kysely<KyselyDatabaseSchema>

// let globalDb: Database | undefined

let globalDb: ZodLevelDatabase | undefined

export const getDbFilePath = () =>
  process.env.TSCI_DEV_SERVER_DB ?? "./.tscircuit/devdb"

export const getDb = async (): Promise<ZodLevelDatabase> => {
  if (globalDb) {
    return globalDb
  }

  const devServerDbPath = getDbFilePath()

  mkdirSync(devServerDbPath, { recursive: true })

  const db = new ZodLevelDatabase(devServerDbPath)

  globalDb = db

  return db
}
