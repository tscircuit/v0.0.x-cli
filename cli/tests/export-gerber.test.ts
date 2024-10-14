import { test, expect, describe } from "bun:test"
import { $ } from "bun"
import { temporaryDirectory } from "tempy"
import { join } from "path/posix"
import { existsSync, readdirSync, readFileSync } from "fs"
import extract from "extract-zip"
import pcbStackup from "pcb-stackup"

test("tsci export gerbers --input example-project/examples/basic-chip.tsx", async () => {
  const tempDir = temporaryDirectory()
  const gerberPath = join(tempDir, "gerbers.zip")
  const { stdout, stderr } =
    await $`bun cli/cli.ts export gerbers --input example-project/examples/basic-chip.tsx --outputfile ${gerberPath} --no-color`

  expect(stderr.toString()).toBe("")
  expect(stdout.toString()).toContain("gerbers.zip")

  expect(existsSync(join(tempDir, "gerbers.zip"))).toBe(true)

  await extract(gerberPath, { dir: join(tempDir, "gerbers") })

  const files = readdirSync(join(tempDir, "gerbers"))
  const expectedFiles = [
    "F_Mask.gbr",
    "F_SilkScreen.gbr",
    "B_Cu.gbr",
    "plated.drl",
    "B_SilkScreen.gbr",
    "F_Cu.gbr",
    "B_Paste.gbr",
    "F_Paste.gbr",
    "B_Mask.gbr",
    "Edge_Cuts.gbr",
  ]

  expectedFiles.forEach((file) => {
    expect(files).toContain(file)
  })

  const gerberOutputMap = Object.entries(
    files.map((filename) => [
      filename,
      readFileSync(join(tempDir, "gerbers", filename)),
    ]),
  )

  // Unfortunately doesn't work in bun yet due to some bug in node:stream
  // expect(gerberOutputMap).toMatchGerberSnapshot(import.meta.path)
})
