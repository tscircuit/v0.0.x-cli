import { z } from "zod"

// Helper function for nullable fields
const nullableText = () => z.string().nullable().default(null)
const id = () => z.any().pipe(z.number().int())

// PackageInfo schema
export const PackageInfoSchema = z.object({
  package_info_id: id(),
  name: z.string(),
})

// DevPackageExample schema
export const DevPackageExampleSchema = z.object({
  dev_package_example_id: id(),
  file_path: z.string(),
  export_name: nullableText(),
  tscircuit_soup: z.any().nullable(), // Using any for JSON type
  completed_edit_events: z.array(z.any()).default([]), // Using any for JSON type
  error: nullableText(),
  is_loading: z.boolean(),
  soup_last_updated_at: nullableText(),
  edit_events_last_updated_at: nullableText(),
  edit_events_last_applied_at: nullableText(),
  last_updated_at: nullableText(),
})

// ExportRequest schema
export const ExportRequestSchema = z.object({
  export_request_id: id(),
  example_file_path: nullableText(),
  export_parameters: z.any().nullable(), // Using any for JSON type
  export_name: nullableText(),
  is_complete: z.boolean(),
  has_error: z.boolean(),
  error: nullableText(),
  created_at: nullableText(),
})

// ExportFile schema
export const ExportFileSchema = z.object({
  export_file_id: id(),
  file_name: nullableText(),
  file_content_base64: z.string().nullable(),
  export_request_id: z.number().int().nullable(),
  created_at: nullableText(),
})

// Combined DBSchema
export const DBSchema = z.object({
  package_info: PackageInfoSchema,
  dev_package_example: DevPackageExampleSchema,
  export_request: ExportRequestSchema,
  export_file: ExportFileSchema,
})

// TypeScript type inference
export type DBSchemaType = z.infer<typeof DBSchema>
export type DBInputSchemaType = z.input<typeof DBSchema>

// You can also export individual types if needed
export type PackageInfo = z.infer<typeof PackageInfoSchema>
export type DevPackageExample = z.infer<typeof DevPackageExampleSchema>
export type ExportRequest = z.infer<typeof ExportRequestSchema>
export type ExportFile = z.infer<typeof ExportFileSchema>
