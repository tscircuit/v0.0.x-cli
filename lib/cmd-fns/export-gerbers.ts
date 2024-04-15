import { AppContext } from "../util/app-context"
import { z } from "zod"
import { exportGerbersToFile } from "lib/export-fns/export-gerbers"

export const exportGerbersCmd = async (ctx: AppContext, args: any) => {
  const params = z
    .object({
      file: z.string(),
      export: z.string().optional(),
      outputfile: z.string().optional().default("gerbers.zip"),
    })
    .parse(args)

  await exportGerbersToFile(
    {
      example_file_path: params.file,
      export_name: params.export,
      output_zip_path: params.outputfile,
    },
    ctx
  )
}
