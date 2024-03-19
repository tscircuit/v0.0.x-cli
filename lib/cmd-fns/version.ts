import { AppContext } from "lib/util/app-context"
import cliPackageJson from "./../../package.json"
import frontendPackageJson from "dev-server-frontend/package.json"

export const versionCmd = async (ctx: AppContext, args: any) => {
  if (typeof global !== "undefined" && (global as any).TSCIRCUIT_VERSION) {
    console.log(`tscircuit@${(global as any).TSCIRCUIT_VERSION}`)
    console.log("")
  }
  console.log(`@tscircuit/cli@${cliPackageJson.version}`)
  console.log(
    `@tscircuit/react-fiber@${cliPackageJson.dependencies["@tscircuit/react-fiber"]}`
  )
  console.log(
    `@tscircuit/schematic-viewer@${frontendPackageJson.dependencies["@tscircuit/schematic-viewer"]}`
  )
  console.log(
    `@tscircuit/pcb-viewer@${frontendPackageJson.dependencies["@tscircuit/pcb-viewer"]}`
  )
  console.log(
    `@tscircuit/builder@${cliPackageJson.dependencies["@tscircuit/builder"]}`
  )
}
