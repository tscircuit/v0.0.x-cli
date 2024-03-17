import type { DbClient } from "./get-db"

export const createSchema = async (db: DbClient) => {
  await db.schema
    .createTable("dev_package_example")
    .addColumn("dev_package_example_id", "integer", (col) =>
      col.primaryKey().autoIncrement()
    )
    .addColumn("file_path", "text", (col) => col.unique())
    .addColumn("export_name", "text")
    .addColumn("tscircuit_soup", "json")
    .addColumn("last_updated_at", "text")
    .execute()
}
