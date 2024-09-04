import { AppContext } from "../util/app-context"
import { z } from "zod"
import * as Path from "path"
import { unlink } from "node:fs/promises"
import { soupify } from "cli/lib/soupify"
import { writeFileSync } from "fs"

export const soupifyCmd = async (ctx: AppContext, args: any) => {
  const params = z
    .object({
      file: z.string(),
      export: z.string().optional(),
      output: z.string().optional(),
      noCore: z.boolean().optional(),
    })
    .parse(args)

  const soup = await soupify(
    {
      filePath: params.file,
      exportName: params.export,
      useCore: !params.noCore,
    },
    ctx,
  )

  if (params.output) {
    await writeFileSync(params.output, JSON.stringify(soup, null, 2))
  } else {
    console.log(JSON.stringify(soup, null, 2))
  }
}
