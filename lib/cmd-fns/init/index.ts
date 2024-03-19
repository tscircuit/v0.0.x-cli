import { AppContext } from "../../util/app-context"
import { z } from "zod"
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  writeFile,
  appendFileSync,
} from "fs"
import * as Path from "node:path"
import $ from "dax-sh"
import { getGeneratedReadme } from "./get-generated-readme"
import { getGeneratedTsconfig } from "./get-generated-tsconfig"
import { getGeneratedNpmrc } from "./get-generated-npmrc"
import { createOrModifyNpmrc } from "./create-or-modify-npmrc"

export const initCmd = async (ctx: AppContext, args: any) => {
  const params = z
    .object({
      name: z.string().optional(),
      dir: z.string().optional(),
      runtime: z.enum(["bun", "node"]).optional(),
    })
    .parse(args)

  if (params.name && !params.dir) {
    params.dir = `./${params.name.split("/").pop()}`
  } else if (!params.dir) {
    params.dir = `.`
  }

  if (!params.name) {
    try {
      const myAccount = await ctx.axios
        .get("/accounts/get")
        .then((r) => r.data.account)
      params.name = `@${myAccount.github_username}/${Path.basename(params.dir)}`
    } catch (e) {
      params.name = Path.basename(params.dir ?? ctx.cwd)
    }
  }

  let runtime = params.runtime
  if (!runtime) {
    const bunExists = $.commandExistsSync("bun")

    if (bunExists) {
      runtime = "bun"
    } else {
      runtime = "node"
    }
  }

  const pkm = runtime === "bun" ? "bun" : "npm"
  const runner = runtime === "bun" ? "bun" : "tsx"

  const packageJsonExists = existsSync(Path.join(params.dir, "package.json"))
  const dirExists = existsSync(params.dir)

  if (!dirExists) {
    console.log(`Creating directory ${params.dir}`)
    mkdirSync(params.dir, { recursive: true })
  }

  process.chdir(params.dir)
  if (!packageJsonExists) {
    console.log(`Initializing ${pkm} project...`)
    await $`${pkm} init -y`
  }

  if (runtime !== "bun") {
    console.log(`Setting up project for typescript...`)
    await $`${pkm} add -D typescript tsx`
  }

  // TODO just allow adding "tscircuit" in the future
  await $`${pkm} add -D tscircuit`

  console.log("Changing package name...")
  // Change package.json "name" to params.name
  const packageJson = JSON.parse(readFileSync("package.json", "utf-8"))
  packageJson.name = params.name
  writeFileSync("package.json", JSON.stringify(packageJson, null, 2))

  console.log('Changing adding "start" and "dev" scripts...')
  packageJson.scripts ??= {}
  packageJson.scripts.start = "npm run dev"
  packageJson.scripts.dev = "tsci dev"
  writeFileSync("package.json", JSON.stringify(packageJson, null, 2))

  console.log(`Adding ".tscircuit" to .gitignore`)
  appendFileSync(".gitignore", "\n.tscircuit\n*.__tmp_entrypoint.tsx\ndist", {
    encoding: "utf-8",
    flag: "a+",
  })

  console.log("Add .npmrc with tscircuit registry...")
  await createOrModifyNpmrc({ quiet: false }, ctx)

  console.log("Creating lib and examples directories...")
  mkdirSync("examples", { recursive: true })
  mkdirSync("lib", { recursive: true })

  writeFileSync(
    Path.join("lib", "MyCircuit.tsx"),
    `
  export const MyCircuit = () => (
    <resistor
      resistance="10kohm"
      name="R1"
      footprint="0805"
    />
  )
  `.trim()
  )

  writeFileSync("index.ts", `export * from "./lib/MyCircuit"`)

  writeFileSync(
    Path.join("examples", "MyExample.tsx"),
    `
import { MyCircuit } from "lib/MyCircuit"

export const MyExample = () => (
  <MyCircuit />
)
      `.trim()
  )

  // Override the README file
  writeFileSync(
    "README.md",
    getGeneratedReadme({
      name: params.name!,
      shouldHaveProjectGeneratedNotice: true,
    })
  )

  // Open tsconfig.json and modify it to import the tscircuit types
  writeFileSync("tsconfig.json", getGeneratedTsconfig())

  console.log("Done! Run `tsci dev` to start developing!")
}
