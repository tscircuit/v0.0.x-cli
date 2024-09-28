import kleur from "kleur"
import { z } from "zod"
import { AppContext } from "../../util/app-context"
import * as Path from "path/posix"
import * as fs from "fs/promises"
import { existsSync, readFileSync } from "fs"
import { getAllPackageFiles } from "cli/lib/util/get-all-package-files"
import prompts from "prompts"
import { getGeneratedReadme } from "../init/get-generated-readme"
import { soupify } from "../../soupify/soupify"
import { inferExportNameFromSource } from "../dev/infer-export-name-from-source"
import $ from "dax-sh"
import semver from "semver"
import { unlink } from "fs/promises"
import esbuild from "esbuild"

export const publish = async (ctx: AppContext, args: any) => {
  const params = z
    .object({
      increment: z.boolean().optional(),
      patch: z.boolean().optional(),
      lock: z.boolean().optional(),
    })
    .parse(args)

  const shouldIncrement = params.increment || params.patch

  if (!existsSync(Path.join(ctx.cwd, "package.json"))) {
    console.log(kleur.red("No package.json found in current directory"))
    process.exit(1)
  }

  const packageJson = JSON.parse(
    await readFileSync(Path.join(ctx.cwd, "package.json"), "utf-8"),
  )

  if (!packageJson.version) {
    console.log(kleur.yellow("No version found in package.json"))
    console.log(kleur.green("Setting package.json version to 0.0.1"))
    packageJson.version = "0.0.1"
    await fs.writeFile(
      Path.join(ctx.cwd, "package.json"),
      JSON.stringify(packageJson, null, 2),
    )
  }

  // This works but doesn't emit types, we're just going to build somewhat
  // normally for now
  // await esbuild.build({
  //   entryPoints: ["index.ts"], // TODO dynamically determine entrypoint
  //   bundle: true,
  //   platform: "node",
  //   packages: "external",
  //   outdir: "dist",
  // })
  await $`npm run build`

  if (packageJson.module) {
    console.log(kleur.yellow("package.json module field detected. Removing..."))
    delete packageJson.module
    await fs.writeFile(
      Path.join(ctx.cwd, "package.json"),
      JSON.stringify(packageJson, null, 2),
    )
  }

  if (packageJson.main !== "./dist/index.cjs") {
    console.log(
      kleur.yellow(
        `package.json "main" field is not set to "./dist/index.cjs". Setting it...`,
      ),
    )
    packageJson.main = "./dist/index.cjs"
    await fs.writeFile(
      Path.join(ctx.cwd, "package.json"),
      JSON.stringify(packageJson, null, 2),
    )
  }
  if (packageJson.types !== "./index.ts") {
    console.log(
      kleur.yellow(
        `package.json "types" field is not set to "./index.ts". Setting it...`,
      ),
    )
    packageJson.types = "./index.ts"
    await fs.writeFile(
      Path.join(ctx.cwd, "package.json"),
      JSON.stringify(packageJson, null, 2),
    )
  }
  if (!packageJson.files) {
    console.log(
      kleur.yellow(
        `package.json "files" field is not set. Setting it to ["./dist", "index.ts", "./lib"]...`,
      ),
    )
    packageJson.files = ["dist", "index.ts", "lib"]
    await fs.writeFile(
      Path.join(ctx.cwd, "package.json"),
      JSON.stringify(packageJson, null, 2),
    )
  }

  // Upload to tscircuit registry
  // 1. Get the package name and version from package.json
  let { name, version } = packageJson
  name = name.replace(/^@/, "") // remove leading @ if it exists
  // 2.1 Check if package already exists, if it doesn't, create it
  const existingPackage = await ctx.axios
    .post("/packages/get", { name })
    .then((r) => r.data.package)
    .catch((e) => {
      if (e.response?.data?.error?.error_code === "package_not_found")
        return null
      throw e
    })

  if (!existingPackage) {
    if (!packageJson.name.includes("/")) {
      console.log(
        kleur.yellow(
          `Package name "${packageJson.name}" is not scoped. Scoped package names are recommended on the tscircuit registry.`,
        ),
      )
      const myAccount = await ctx.axios
        .get("/accounts/get")
        .then((r) => r.data.account)
      const newScopedName = `${myAccount.github_username}/${packageJson.name}`

      const { confirmNameChange } = await prompts({
        type: "confirm",
        name: "confirmNameChange",
        initial: true,
        message: `Would you like to change the package name to the scoped name "@${newScopedName}"?`,
      })

      if (confirm === undefined) {
        console.log(kleur.red("Aborted."))
        process.exit(1)
      }

      if (confirmNameChange) {
        packageJson.name = `@${newScopedName}`
        await fs.writeFile(
          Path.join(ctx.cwd, "package.json"),
          JSON.stringify(packageJson, null, 2),
        )
        name = newScopedName
      }
    }

    console.log(
      kleur.green(
        `Creating package "${packageJson.name}" on tscircuit registry...`,
      ),
    )
    let description = packageJson.description
    if (!description) {
      description = (
        await prompts({
          type: "text",
          name: "description",
          message: "Enter a description for the package",
        })
      ).description
    }
    await ctx.axios
      .post("/packages/create", { name, description })
      .then((r) => r.data.package)
  }
  // 2.2 Check if package release already exists
  const existingRelease = await ctx.axios
    .post("/package_releases/get", {
      package_name_with_version: `${name}@${version}`,
    })
    .then((r) => r.data.package_release)
    .catch((e) => {
      if (e.response?.data?.error?.error_code === "package_release_not_found")
        return null
      throw e
    })
  // 3. If it does, ask to increment the version or update the existing release, if increment is specified, increment the version automatically
  if (existingRelease) {
    console.log(
      kleur.gray(`Package release already exists: ${name}@${version}`),
    )
    if (shouldIncrement) {
      console.log(
        kleur.green(
          `Incrementing version from ${version} to ${semver.inc(
            version,
            "patch",
          )}...`,
        ),
      )
      version = semver.inc(version, "patch")
      packageJson.version = version
      await fs.writeFile(
        Path.join(ctx.cwd, "package.json"),
        JSON.stringify(packageJson, null, 2),
      )
    } else {
      console.log(
        kleur.blue(
          `Want to increment the version and publish a new release? Use "--increment"!`,
        ),
      )

      throw new Error("Package release already exists")
    }
  }
  // 4. Create new package_release
  const newRelease = await ctx.axios
    .post("/package_releases/create", {
      package_name_with_version: `${name}@${version}`,
      is_latest: false, // only make it latest when locking
    })
    .then((r) => r.data.package_release)
  // 5. Upload package_files
  const filePaths = await getAllPackageFiles(ctx)
  if (!filePaths.includes("README.md")) {
    console.log(
      kleur.yellow(
        "No README.md found in package files. A README.md is recommended on the tscircuit registry.",
      ),
    )
    const { confirmReadme } = await prompts({
      type: "confirm",
      name: "confirmReadme",
      initial: true,
      message: "Would you like to add a README.md?",
    })

    if (confirmReadme === undefined) {
      console.log(kleur.red("Aborted."))
      process.exit(1)
    }

    if (confirmReadme) {
      await fs.writeFile(
        Path.join(ctx.cwd, "README.md"),
        getGeneratedReadme({ name }),
      )
      filePaths.push("README.md")
    }
  }

  for (const filePath of filePaths) {
    const fileContent = await fs.readFile(Path.join(ctx.cwd, filePath))

    await ctx.axios
      .post("/package_files/create", {
        file_path: filePath,
        content_text: fileContent.toString(),
        package_name_with_version: `${name}@${version}`,
      })
      .then((r) => r.data.package_file)
  }
  // 6. Upload package_examples
  const exampleFilePaths = filePaths.filter((fp) => fp.startsWith("examples/"))
  for (const filePath of exampleFilePaths) {
    const fileContent = (
      await fs.readFile(Path.join(ctx.cwd, filePath))
    ).toString()

    const exportName = inferExportNameFromSource(fileContent)

    const tscircuit_soup = await soupify(
      {
        filePath,
        exportName,
      },
      ctx,
    ).catch((e) => e)

    if (tscircuit_soup instanceof Error) {
      console.log(
        kleur.red(`Error soupifying ${filePath}: ${tscircuit_soup}, skipping`),
      )
      continue
    }

    await ctx.axios
      .post("/package_examples/create", {
        file_path: filePath,
        package_name_with_version: `${name}@${version}`,
        export_name: exportName,
        source_content: fileContent,
        tscircuit_soup,
      })
      .then((r) => r.data.package_example)
  }

  // 7. Create tarball and upload
  const tmpTarballPath = Path.join(
    ctx.cwd,
    ".tscircuit/tmp",
    `${name.replace(/\//g, "-")}-${version}.tgz`,
  )
  await fs.mkdir(Path.dirname(tmpTarballPath), { recursive: true })
  const npm_pack_outputs = await $`cd ${
    ctx.cwd
  } && npm pack --json --pack-destination ${Path.dirname(
    tmpTarballPath,
  )}`.json()

  if (!existsSync(tmpTarballPath)) {
    console.log(kleur.red(`Couldn't find tarball at ${tmpTarballPath}`))
    process.exit(1)
  }

  // Upload tarball
  await ctx.axios.post("/package_files/create", {
    file_path: `.tscircuit-internal/tarball.tgz`,
    content_base64: (await fs.readFile(tmpTarballPath)).toString("base64"),
    package_name_with_version: `${name}@${version}`,
    is_release_tarball: true,
    npm_pack_output: npm_pack_outputs?.[0],
  })

  // Clean up .tscircuit/tmp
  await unlink(tmpTarballPath)

  // 8. Lock/set release to latest version
  await ctx.axios.post("/package_releases/update", {
    package_name_with_version: `${name}@${version}`,
    is_locked: params.lock ? true : false,
    is_latest: true,
  })

  console.log(
    kleur.green(
      `Published ${name}@${version}!\nhttps://registry.tscircuit.com/${name}`,
    ),
  )
}
