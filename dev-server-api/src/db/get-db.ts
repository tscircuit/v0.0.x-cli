import { Kysely, sql, type Generated, SqliteDialect } from "kysely"
import { createSchema } from "./create-schema"
import { mkdirSync } from "fs"
import * as Path from "path"

export interface DevPackageExample {
  dev_package_example_id: Generated<number>
  tscircuit_soup: any
  file_path: string
  export_name: string
  error: string | null
  is_loading: 1 | 0
  last_updated_at: string
}

export interface ExportRequest {
  export_request_id: Generated<number>
  example_file_path: string
  export_parameters: string
  export_name: string
  is_complete: 1 | 0
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
}

export type DbClient = Kysely<KyselyDatabaseSchema>

// let globalDb: Database | undefined

let globalDb: Kysely<KyselyDatabaseSchema> | undefined

export const getDbFilePath = () =>
  process.env.TSCI_DEV_SERVER_DB ?? "./.tscircuit/dev-server.sqlite"

export const getDb = async (): Promise<Kysely<KyselyDatabaseSchema>> => {
  if (globalDb) return globalDb

  const devServerDbPath = getDbFilePath()

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

  const schemaExistsResult = await sql`
    SELECT name
    FROM sqlite_master
    WHERE type='table' AND name='dev_package_example'
  `.execute(db)

  if (schemaExistsResult.rows.length === 0) {
    await createSchema(db)
  }

  return db
}
