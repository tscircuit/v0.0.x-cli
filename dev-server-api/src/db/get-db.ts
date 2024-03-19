import { Kysely, sql, type Generated, SqliteDialect } from "kysely"
import { createSchema } from "./create-schema"
import { mkdirSync } from "fs"
import * as Path from "path"

interface DevPackageExample {
  dev_package_example_id: Generated<number>
  tscircuit_soup: any
  file_path: string
  export_name: string
  error: string | null
  last_updated_at: string
}

interface KyselyDatabaseSchema {
  dev_package_example: DevPackageExample
}

export type DbClient = Kysely<KyselyDatabaseSchema>

// let globalDb: Database | undefined

let globalDb: Kysely<KyselyDatabaseSchema> | undefined

export const getDb = async (): Promise<Kysely<KyselyDatabaseSchema>> => {
  if (globalDb) return globalDb

  const devServerDbPath =
    process.env.TSCI_DEV_SERVER_DB ?? "./.tscircuit/dev-server.db"

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
