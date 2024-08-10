import { AppContext } from "../util/app-context"
import { z } from "zod"

export const packageExamplesGet = async (ctx: AppContext, args: any) => {
  const params = z
    .object({
      packageExampleId: z.string().uuid(),
    })
    .parse(args)

  const { packageExampleId: package_example_id } = params

  const package_example = await ctx.axios
    .post("/package_examples/get", {
      package_example_id,
    })
    .then((r) => r.data.package_example)

  console.log(package_example)
}
