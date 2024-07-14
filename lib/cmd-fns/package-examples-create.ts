import { soupify } from "lib/soupify"
import { AppContext } from "../util/app-context"
import { z } from "zod"
import fs from "fs"

export const packageExamplesCreate = async (ctx: AppContext, args: any) => {
  const params = z
    .object({
      packageNameWithVersion: z.string(),
      file: z.string(),
      export: z.string().optional().default("default"),
      no_cleanup: z.boolean().optional().default(true),
    })
    .parse(args)

  const tscircuit_soup = await soupify(
    {
      filePath: params.file,
      exportName: params.export,
      no_cleanup: params.no_cleanup,
    },
    ctx
  )

  const fileContent = await fs.promises.readFile(params.file, "utf8")

  const package_example = await ctx.axios
    .post("/package_examples/create", {
      package_name_with_version: params.packageNameWithVersion,
      file_path: params.file,
      export_name: params.export,
      source_content: fileContent,
      tscircuit_soup,
    })
    .then((r) => r.data.package_example)

  console.log(package_example)
}
