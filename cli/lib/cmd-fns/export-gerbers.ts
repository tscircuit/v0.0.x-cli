import { AppContext } from "../util/app-context"
import { z } from "zod"
import { exportGerbersToFile } from "cli/lib/export-fns/export-gerbers"

export const exportGerbersCmd = async (ctx: AppContext, args: any) => {
  const params = z
    .object({
      file: z.string().optional(),
      input: z.string().optional(),
      export: z.string().optional(),
      outputfile: z.string().optional().default("gerbers.zip"),
    })
    .refine((data) => data.file || data.input, {
      message: "Either 'file' or 'input' must be provided",
    })
    .parse(args)

  const inputFile = params.input || params.file

  await exportGerbersToFile(
    {
      example_file_path: inputFile!,
      export_name: params.export,
      output_zip_path: params.outputfile,
    },
    ctx,
  )
}
