import { test, expect, describe } from "bun:test"
import { $ } from "bun"
import { temporaryDirectory } from "tempy"
import { join } from "path/posix"
import { existsSync, readFileSync } from "fs"

test("tsci export kicad_pcb --input example-project/examples/macrokeypad.tsx", async () => {
  const tempDir = temporaryDirectory()
  const kicadPcbPath = join(tempDir, "output.kicad_pcb")
  const { stdout, stderr } =
    await $`bun cli/cli.ts export kicad_pcb --input example-project/examples/macrokeypad.tsx --outputfile ${kicadPcbPath} --no-color`

  expect(stderr.toString()).toBe("")
  expect(stdout.toString()).toContain("output.kicad_pcb")

  expect(existsSync(kicadPcbPath)).toBe(true)

  const kicadPcbContent = readFileSync(kicadPcbPath, "utf-8")
  expect(kicadPcbContent).toContain("(kicad_pcb")
  expect(kicadPcbContent).toContain("(version")
  expect(kicadPcbContent).toContain("(footprint")
  expect(kicadPcbContent).toContain("(layer")
})
