import mainPkg from "./package.json"
import apiPkg from "./dev-server-api/package.json"

await Bun.build({
  entrypoints: ["./cli.ts"],
  external: [
    ...Object.keys(mainPkg.dependencies),
    ...Object.keys(mainPkg.devDependencies),
    ...Object.keys(apiPkg.dependencies),
    ...Object.keys(apiPkg.devDependencies),
  ],
  outdir: "dist",
  target: "node",
})
