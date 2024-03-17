import { AppContext } from "../util/app-context"

export const packagesList = async (ctx: AppContext, args: any) => {
  const {
    data: { packages },
  } = await ctx.axios.post("/packages/list", {})

  if (packages.length === 0) {
    console.log("No packages found")
  } else {
    console.log("packages:")
  }
  for (const pkg of packages) {
    console.log(`- ${pkg.name}`)
  }
}
