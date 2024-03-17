import { AppContext } from "../util/app-context"
import { z } from "zod"

export const packagesCreate = async (ctx: AppContext, args: any) => {
  const params = z
    .object({
      name: z.string(),
      description: z.string().optional(),
      authorAccountId: z.string().optional(),
    })
    .parse(args)

  await ctx.axios.post("/packages/create", params)

  console.log(`Package "${params.name}" created!`)
}
