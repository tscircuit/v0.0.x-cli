import { mkdirSync } from "fs"
import * as Path from "path"
import { ZodLevelDatabase } from "./zod-level-db"

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

  db.open()

  globalDb = db

  return db
}
