import { AppContext } from "lib/util/app-context"
import cliPackageJson from "./../../package.json"
import frontendPackageJson from "dev-server-frontend/package.json"

export const versionCmd = async (ctx: AppContext, args: any) => {
  const tscircuitPackageJson = await import(
    "tscircuit/package.json" as any
  ).catch((e) => ({ version: "" }))
  const reactFiberPackageJson = await import(
    "@tscircuit/react-fiber/package.json"
  ).catch((e) => ({ version: "" }))
  const builderPackageJson = await import(
    "@tscircuit/builder/package.json"
  ).catch((e) => ({ version: "" }))
  if (tscircuitPackageJson.version) {
    console.log(`tscircuit@${cliPackageJson.version}`)
  }
  console.log(`@tscircuit/cli@${cliPackageJson.version}`)
  console.log(`@tscircuit/react-fiber@${reactFiberPackageJson.version}`)
  console.log(
    `@tscircuit/schematic-viewer@${frontendPackageJson.dependencies["@tscircuit/schematic-viewer"]}`
  )
  console.log(
    `@tscircuit/pcb-viewer@${frontendPackageJson.dependencies["@tscircuit/pcb-viewer"]}`
  )
  console.log(`@tscircuit/builder@${builderPackageJson.version}`)
}
