import mainPkg from "./package.json"

await Bun.build({
  entrypoints: ["./cli.ts"],
  external: [
    ...Object.keys(mainPkg.dependencies),
    ...Object.keys(mainPkg.devDependencies),
    ...Object.keys(mainPkg.peerDependencies),
  ],
  outdir: "dist",
  target: "node",
})
