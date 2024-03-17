import { AppContext } from "../util/app-context"
import { z } from "zod"

export const packagesGet = async (ctx: AppContext, args: any) => {
  args.packageId = args.package_id
  const params = z
    .object({ package_id: z.string() })
    .or(z.object({ name: z.string() }))
    .parse(args)

  const {
    data: { package: pkg },
  } = await ctx.axios.post("/packages/get", params)

  console.log(pkg)
}
