import {
  AbstractLevel,
  AbstractIterator,
  AbstractKeyIterator,
  AbstractValueIterator,
} from "abstract-level"
import { promises as fs } from "fs"
import path from "path"

interface JSONLevelOptions {}

/**
 * This is not totally tested yet, but is basically a NodeJS level that doesn't
 * use C-bindings. It could be used as a replacement for memory-level to store
 * to disk.
 */
class GenericJsonLevel extends AbstractLevel<string, any> {
  private location: string

  constructor(location: string, options?: JSONLevelOptions) {
    super({ ...options, encodings: { utf8: true } })
    this.location = location
  }

  async _open(): Promise<void> {
    await fs.mkdir(this.location, { recursive: true })
  }

  async _put(key: string, value: any): Promise<void> {
    const filePath = path.join(this.location, `${key}.json`)
    console.log("writing file", filePath)
    await fs.writeFile(filePath, JSON.stringify(value))
  }

  async _get(key: string): Promise<any> {
    const filePath = path.join(this.location, `${key}.json`)
    try {
      const data = await fs.readFile(filePath, "utf8")
      return JSON.parse(data)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        throw new Error("NotFoundError")
      }
      throw error
    }
  }

  async _del(key: string): Promise<void> {
    const filePath = path.join(this.location, `${key}.json`)
    try {
      await fs.unlink(filePath)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error
      }
    }
  }

  async _batch(
    operations: Array<{ type: "put" | "del"; key: string; value?: any }>
  ): Promise<void> {
    for (const op of operations) {
      if (op.type === "put") {
        await this._put(op.key, op.value)
      } else if (op.type === "del") {
        await this._del(op.key)
      }
    }
  }

  async _clear(): Promise<void> {
    const files = await fs.readdir(this.location)
    for (const file of files) {
      if (file.endsWith(".json")) {
        await fs.unlink(path.join(this.location, file))
      }
    }
  }

  _iterator(): AbstractIterator<this, string, any> {
    let files: string[] = []
    let index = 0

    const nextFile = async (): Promise<{ key: string; value: any } | null> => {
      if (index >= files.length) {
        return null
      }

      const file = files[index++]
      const key = path.basename(file, ".json")
      const filePath = path.join(this.location, file)
      const data = await fs.readFile(filePath, "utf8")
      const value = JSON.parse(data)

      return { key, value }
    }

    return {
      async next() {
        if (files.length === 0) {
          files = (await fs.readdir(this.db.location)).filter((file) =>
            file.endsWith(".json")
          )
        }

        const entry = await nextFile()
        if (entry === null) {
          return undefined
        }

        return [entry.key, entry.value]
      },
      async seek(target: string) {
        index = files.findIndex((file) => file.startsWith(target))
        if (index === -1) {
          index = files.length
        }
      },
      async end() {
        // No resources to clean up
      },
    }
  }
}

export { GenericJsonLevel }
