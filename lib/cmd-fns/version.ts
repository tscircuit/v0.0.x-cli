import { AppContext } from "lib/util/app-context"
import cliPackageJson from "./../../package.json"
import frontendPackageJson from "dev-server-frontend/package.json"

export const versionCmd = async (ctx: AppContext, args: any) => {
  if (typeof global !== "undefined" && (global as any).TSCIRCUIT_VERSION) {
    console.log(`tscircuit@${(global as any).TSCIRCUIT_VERSION}`)
    console.log("")
  }

  const table: { name: string; current: string; latest?: string }[] = []

  table.push({ name: "@tscircuit/cli", current: cliPackageJson.version })
  table.push({
    name: "@tscircuit/react-fiber",
    current: cliPackageJson.dependencies["@tscircuit/react-fiber"],
  })
  table.push({
    name: "@tscircuit/schematic-viewer",
    current: frontendPackageJson.dependencies["@tscircuit/schematic-viewer"],
  })
  table.push({
    name: "@tscircuit/pcb-viewer",
    current: frontendPackageJson.dependencies["@tscircuit/pcb-viewer"],
  })
  table.push({
    name: "@tscircuit/builder",
    current: cliPackageJson.dependencies["@tscircuit/builder"],
  })

  if (args.showLatest) {
    // Get the latest version for each package
    for (const row of table) {
      const { name } = row
      const { data: packageInfo } = await ctx.axios.get(
        "https://registry.npmjs.org/" + name
      )
      row.latest = packageInfo["dist-tags"].latest
    }
  }

  console.table(table)
}
