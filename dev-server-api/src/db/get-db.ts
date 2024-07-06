import { mkdirSync } from "fs"
import { Kysely, SqliteDialect, sql, type Generated } from "kysely"
import * as Path from "path"
import { createSchema } from "./create-schema"

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

let globalDb: Kysely<KyselyDatabaseSchema> | undefined

export const getDbFilePath = () =>
  process.env.TSCI_DEV_SERVER_DB ?? "./.tscircuit/devdb.json"

export const getDb = async (): Promise<Kysely<KyselyDatabaseSchema>> => {
  if (globalDb) return globalDb

  const devServerDbPath = getDbFilePath()
  // console.log(`Using dev server db at ${devServerDbPath}`)

  mkdirSync(Path.dirname(devServerDbPath), { recursive: true })

  // better-sqlite3 doesn't work in bun, so if we see we can use the bun
  // alternative, attempt to use that instead
  let dialect: any

  if (typeof Bun !== "undefined") {
    // console.log("Attempting to use bun-sqlite")
    try {
      const { BunSqliteDialect } = await import("kysely-bun-sqlite")
      const { Database } = await import("bun:sqlite")
      dialect = new BunSqliteDialect({
        database: new Database(devServerDbPath, {
          create: true,
        }),
      })
    } catch (e) {}
  }

  if (!dialect) {
    // console.log("Attempting to use better-sqlite3")
    try {
      const BetterSqlite3 = await import("better-sqlite3")
      dialect = new SqliteDialect({
        database: new BetterSqlite3.default(devServerDbPath),
      })
    } catch (e) {}
  }

  if (!dialect) {
    throw new Error("Was not able to load sqlite dialect")
  }

  const db = new Kysely<KyselyDatabaseSchema>({
    dialect,
  })

  await sql`pragma busy_timeout = 5000`.execute(db)

  const schemaExistsResult = await sql`
    SELECT name
    FROM sqlite_master
    WHERE type='table' AND name IN ('dev_package_example', 'export_request', 'export_file', 'package_info')
  `.execute(db)

  // Check if the number of existing tables matches the number of required tables
  if (schemaExistsResult.rows.length < 4) {
    await createSchema(db)
  }

  globalDb = db

  return db
}
