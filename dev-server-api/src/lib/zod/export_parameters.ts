import { z } from "zod"

export const export_parameters = z.object({
  should_export_gerber_zip: z.boolean().default(false),
  gerbers_zip_file_name: z
    .string()
    .nullable()
    .optional()
    .default("gerbers.zip"),
})
