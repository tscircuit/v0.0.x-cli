// import { Level } from "level"
// import { GenericJsonLevel } from "./generic-json-level"
import { MemoryLevel } from "memory-level"
import { z } from "zod"
import { DBSchema, type DBSchemaType, type DBInputSchemaType } from "./schema"

// Create a wrapper class for Level with Zod validation
export class ZodLevelDatabase {
  private db: MemoryLevel<string, any>

  constructor(location: string) {
    this.db = new MemoryLevel() // new GenericJsonLevel(location)
  }

  async open() {
    return this.db.open()
  }

  async close() {
    return this.db.close()
  }

  async get<K extends keyof DBSchemaType>(
    collection: K,
    id: string | number
  ): Promise<DBSchemaType[K] | null> {
    const key = `${collection}:${id}`
    const data = await this.db.get(key)
    return DBSchema.shape[collection].parse(JSON.parse(data)) as any
  }

  async put<K extends keyof DBSchemaType>(
    collection: K,
    value: DBInputSchemaType[K]
  ): Promise<DBSchemaType[K]> {
    const idkey = `${collection}_id`
    const valueLoose: any = value
    if (!valueLoose[idkey]) {
      // generate an id using the "count" key
      let count = await this.db.get(`${collection}.count`).catch(() => 1)
      if (typeof count === "string") count = parseInt(count)
      ;(value as any)[idkey] = count
      await this.db.put(`${collection}.count`, (count + 1).toString())
    }
    const key = `${collection}:${valueLoose[idkey]}`
    const validatedData = DBSchema.shape[collection].parse(value)
    await this.db.put(key, JSON.stringify(validatedData))
    return validatedData as DBSchemaType[K]
  }

  async del<K extends keyof DBSchemaType>(
    collection: K,
    id: string
  ): Promise<void> {
    const key = `${collection}:${id}`
    await this.db.del(key)
  }

  async find<K extends keyof DBSchemaType>(
    collection: K,
    partialObject: Partial<DBSchemaType[K]>
  ): Promise<DBSchemaType[K] | null> {
    const schema = DBSchema.shape[collection]

    for await (const [key, value] of this.db.iterator({
      gte: `${collection}:`,
      lte: `${collection}:\uffff`,
    })) {
      try {
        const parsedValue = schema.parse(JSON.parse(value))
        if (this.matchesPartialObject(parsedValue, partialObject)) {
          return parsedValue as any
        }
      } catch (error) {
        console.error(`Error parsing value for key ${key}:`, error)
      }
    }

    return null
  }

  async findOrThrow<K extends keyof DBSchemaType>(
    collection: K,
    partialObject: Partial<DBSchemaType[K]>
  ): Promise<DBSchemaType[K]> {
    const result = await this.find(collection, partialObject)
    if (!result) {
      throw new Error(
        `No record in "${collection}" matches query ${JSON.stringify(
          partialObject
        )}`
      )
    }
    return result
  }

  private matchesPartialObject<T>(
    fullObject: T,
    partialObject: Partial<T>
  ): boolean {
    for (const [key, value] of Object.entries(partialObject)) {
      if (fullObject[key as keyof T] !== value) {
        return false
      }
    }
    return true
  }

  async dump(): Promise<DBSchemaType> {
    // Serialize all data in the database
    const dump: any = {}
    for await (const [key, value] of this.db.iterator({})) {
      const [collection, id] = key.split(":")
      if (!dump[collection]) {
        dump[collection] = {}
      }
      dump[collection][id] = JSON.parse(value)
    }
    return dump
  }

  async list<K extends keyof DBSchemaType>(
    collection: K
  ): Promise<DBSchemaType[K][]> {
    const schema = DBSchema.shape[collection]
    const results: DBSchemaType[K][] = []

    for await (const [key, value] of this.db.iterator({
      gte: `${collection}:`,
      lte: `${collection}:\uffff`,
    })) {
      if (key.endsWith(".count")) continue
      try {
        const parsedValue = schema.parse(JSON.parse(value))
        results.push(parsedValue as DBSchemaType[K])
      } catch (error) {
        console.error(`Error parsing value for key ${key}:`, error)
      }
    }

    return results
  }

  async clear() {
    return this.db.clear()
  }
}
