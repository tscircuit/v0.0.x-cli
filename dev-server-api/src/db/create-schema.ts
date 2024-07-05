import type { DbClient } from "./get-db"

export const createSchema = async (db: DbClient) => {
  console.log("Creating schema...")
  await db.schema
    .createTable("package_info")
    .addColumn("name", "text", (col) => col.notNull())
    .execute()

  await db.schema
    .createTable("dev_package_example")
    .addColumn("dev_package_example_id", "integer", (col) =>
      col.primaryKey().autoIncrement()
    )
    .addColumn("file_path", "text", (col) => col.unique())
    .addColumn("export_name", "text")
    .addColumn("tscircuit_soup", "json")
    .addColumn("completed_edit_events", "json")
    .addColumn("error", "text")
    .addColumn("is_loading", "boolean", (cb) => cb.defaultTo(0).notNull())
    .addColumn("soup_last_updated_at", "text")
    .addColumn("edit_events_last_updated_at", "text")
    .addColumn("edit_events_last_applied_at", "text")
    .addColumn("last_updated_at", "text")
    .execute()

  await db.schema
    .createTable("export_request")
    .addColumn("export_request_id", "integer", (col) =>
      col.primaryKey().autoIncrement()
    )
    .addColumn("example_file_path", "text")
    .addColumn("export_parameters", "json")
    .addColumn("export_name", "text")
    .addColumn("is_complete", "boolean", (col) => col.defaultTo(0).notNull())
    .addColumn("has_error", "boolean", (col) => col.defaultTo(0).notNull())
    .addColumn("error", "text")
    .addColumn("created_at", "text")
    .execute()

  await db.schema
    .createTable("export_file")
    .addColumn("export_file_id", "integer", (col) =>
      col.primaryKey().autoIncrement()
    )
    .addColumn("file_name", "text")
    .addColumn("file_content", "blob")
    .addColumn("is_complete", "boolean", (col) => col.defaultTo(0).notNull())
    .addColumn("export_request_id", "integer", (col) =>
      col.references("export_request.export_request_id")
    )
    .addColumn("created_at", "text")
    .execute()
}
