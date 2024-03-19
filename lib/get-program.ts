import { Command } from "commander"
import packageJson from "../package.json"
import { AppContext } from "./util/app-context"
import * as CMDFN from "lib/cmd-fns"

// | Endpoint                              | Description                  |
// | ------------------------------------- | ---------------------------- |
// | /packages/search         | Search for packages          |
// | /packages/list           | List packages with a filter  |
// | /packages/get            | Get a package by id or name  |
// | /packages/create         | Create a new package         |
// | /package_releases/list   | List package releases        |
// | /package_releases/get    | Get a package release by id  |
// | /package_releases/create | Create a new package release |
// | /package_files/list      | List package files           |
// | /package_files/get       | Get a package file by id     |
// | /package_files/download  | Download a package file      |
// | /package_files/create    | Create a new package file    |
// | /package_examples/list   | List package examples        |
// | /package_examples/get    | Get a package example by id  |
// | /package_examples/create | Create a new package example |

export const getProgram = (ctx: AppContext) => {
  const cmd = new Command("tsci")

  const authCmd = cmd.command("auth")
  authCmd.command("login").action((args) => CMDFN.authLogin(ctx, args))
  authCmd.command("logout").action((args) => CMDFN.authLogout(ctx, args))

  const configCmd = cmd.command("config")

  configCmd
    .command("reveal-location")
    .action((args) => CMDFN.configRevealLocation(ctx, args))
  configCmd
    .command("set-registry")
    .requiredOption("--server <server>", "Registry URL")
    .action((args) => CMDFN.configSetRegistry(ctx, args))
  configCmd
    .command("set-session")
    .requiredOption("--session-token <session_token>", "Session Token")
    .action((args) => CMDFN.configSetSession(ctx, args))
  configCmd
    .command("set-log-requests")
    .requiredOption("--log-requests", "Should log requests to registry")
    .action((args) => CMDFN.configSetLogRequests(ctx, args))
  configCmd
    .command("print-config")
    .action((args) => CMDFN.configPrintConfig(ctx, args))
  configCmd.command("clear").action((args) => CMDFN.configClear(ctx, args))

  const authSessionsCmd = authCmd.command("sessions")

  authSessionsCmd
    .command("create")
    .action((args) => CMDFN.authSessionsCreate(ctx, args))
  authSessionsCmd
    .command("list")
    .action((args) => CMDFN.authSessionsList(ctx, args))
  authSessionsCmd
    .command("get")
    .action((args) => CMDFN.authSessionsGet(ctx, args))

  const packagesCmd = cmd.command("packages")

  packagesCmd.command("list").action((args) => CMDFN.packagesList(ctx, args))
  packagesCmd
    .command("get")
    .option("--package-id <package_id>", "Package Id")
    .option("--name <name>", "Package name")
    .action((args) => CMDFN.packagesGet(ctx, args))
  packagesCmd
    .command("create")
    .requiredOption("--name <name>", "Package name")
    .option("--author-id <author_account_id>", "Author Id")
    .option("--description <description>", "Package description")
    .action((args) => CMDFN.packagesCreate(ctx, args))

  const packageReleases = cmd.command("package_releases")

  packageReleases
    .command("list")
    .requiredOption("--package-name <package_name>", "Package name")
    .option("--verbose", "Verbose objects (includes uuids)")
    .action((args) => CMDFN.packageReleasesList(ctx, args))
  packageReleases
    .command("get")
    .action((args) => CMDFN.packageReleasesGet(ctx, args))
  packageReleases
    .command("create")
    .option(
      "-p, --package-name-with-version <package_name_with_version>",
      "Package name and version"
    )
    .option("--package-name <package_name>", "Package name")
    .option("--release-version <release_version>", "Version to publish")
    .action((args) => CMDFN.packageReleasesCreate(ctx, args))
  packageReleases
    .command("update")
    .option(
      "-p, --package-name-with-version <package_name_with_version>",
      "Package name and version"
    )
    .option("--is-latest", "Make package release the latest version")
    .option("--is-locked", "Lock the release")
    .action((args) => CMDFN.packageReleasesUpdate(ctx, args))

  const packageFiles = cmd.command("package_files")

  packageFiles
    .command("list")
    .option(
      "--package-name-with-version <package_name_with_version>",
      "Package name with version"
    )
    .option(
      "--package-name <package_name>",
      "Package name (use latest version)"
    )
    .option("--package-release-id <package_release_id>", "Package Release Id")
    .action((args) => CMDFN.packageFilesList(ctx, args))
  packageFiles.command("get").action((args) => CMDFN.packageFilesGet(ctx, args))
  packageFiles
    .command("download")
    .requiredOption(
      "--package-name-with-version <package_name_with_version>",
      "Package name and version"
    )
    .requiredOption("--remote-file-path <remote_file_path>", "Remote file path")
    .option(
      "--output <output>",
      "Output file path (optional), prints to stdout if not provided"
    )
    .action((args) => CMDFN.packageFilesDownload(ctx, args))
  packageFiles
    .command("create")
    .option(
      "-p, --package-release-id <package_release_id>",
      "Package Release Id"
    )
    .option(
      "--package-name-with-version <package_name_with_version>",
      "Package name with version e.g. @tscircuit/arduino@1.2.3"
    )
    .requiredOption("--file <file>", "File to upload")
    .action((args) => CMDFN.packageFilesCreate(ctx, args))

  packageFiles
    .command("upload-directory")
    .requiredOption("--dir <dir>", "Directory to upload")
    .action((args) => CMDFN.packageFilesUploadDirectory(ctx, args))

  const packageExamples = cmd.command("package_examples")

  packageExamples
    .command("list")
    .requiredOption("--package-name-with-version <package_name_with_version>")
    .action((args) => CMDFN.packageExamplesList(ctx, args))
  packageExamples
    .command("get")
    .requiredOption("--package-example-id <package_example_id>")
    .action((args) => CMDFN.packageExamplesGet(ctx, args))
  packageExamples
    .command("create")
    .requiredOption("--package-name-with-version <package_name_with_version>")
    .requiredOption("--file <file>")
    .option("--export <export>", "Name of export to soupify")
    .action((args) => CMDFN.packageExamplesCreate(ctx, args))

  cmd
    .command("publish")
    .option("--increment", "Increase patch version")
    .option("--patch", "Increase patch version")
    .option("--lock", "Lock the release after publishing to prevent changes")
    .action((args) => CMDFN.publish(ctx, args))

  cmd.command("version").action((args) => CMDFN.version(ctx, args))

  cmd.command("login").action((args) => CMDFN.authLogin(ctx, args))
  cmd.command("logout").action((args) => CMDFN.authLogout(ctx, args))

  cmd
    .command("soupify")
    .requiredOption("--file <file>", "Input example files")
    .option(
      "--export <export_name>",
      "Name of export to soupify, if not specified, soupify the default/only export"
    )
    .action((args) => CMDFN.soupify(ctx, args))

  cmd
    .command("dev")
    .option("--cwd <cwd>", "Current working directory")
    .option("--port <port>", "Port to run dev server on")
    .action((args) => CMDFN.dev(ctx, args))

  cmd
    .command("init")
    .option("--name <name>", "Name of the project")
    .option(
      "--runtime <runtime>",
      "Runtime to use (attempts to bun, otherwise node/tsx)"
    )
    .option(
      "--dir <dir>",
      "Directory to initialize (defaults to ./<name> or . if name not provided)"
    )
    .action((args) => CMDFN.init(ctx, args))

  cmd
    .command("add")
    .argument(
      "<packages...>",
      "Packages to install from registry.tscircuit.com, optionally with version"
    )
    .option("-D, --dev", "Add to devDependencies")
    .action((packages, flags) => CMDFN.add(ctx, { packages, flags }))

  cmd
    .command("remove")
    .argument("<packages...>", "Packages to remove")
    .action((packages, flags) => CMDFN.remove(ctx, { packages, flags }))

  cmd
    .command("install")
    .argument(
      "<packages...>",
      "Packages to install from registry.tscircuit.com, optionally with version"
    )
    .option("-D, --dev", "Add to devDependencies")
    .action((packages, flags) => CMDFN.install(ctx, { packages, flags }))

  cmd
    .command("uninstall")
    .argument("<packages...>", "Packages to uninstall")
    .action((packages, flags) => CMDFN.install(ctx, { packages, flags }))

  const devServerCmd = cmd.command("dev-server")

  devServerCmd
    .command("upload")
    .option(
      "--dir <dir>",
      "Directory to upload (defaults to current directory)"
    )
    .option("-w, --watch", "Watch for changes")
    .option("-p, --port", "Port dev server is running on (default: 3020)")
    .action((args) => CMDFN.devServerUpload(ctx, args))

  cmd.command("open").action((args) => CMDFN.open(ctx, args))

  return cmd
}
