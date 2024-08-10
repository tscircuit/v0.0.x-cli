import { AppContext } from "../util/app-context"
import { z } from "zod"

export const packageExamplesList = async (ctx: AppContext, args: any) => {
  const params = z
    .object({
      packageNameWithVersion: z.string(),
    })
    .parse(args)

  const package_examples = await ctx.axios
    .post("/package_examples/list", {
      package_name_with_version: params.packageNameWithVersion,
    })
    .then((r) => r.data.package_examples)

  console.log(package_examples)
}
