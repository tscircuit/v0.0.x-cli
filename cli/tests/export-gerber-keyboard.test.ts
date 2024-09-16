import { test, expect, describe } from "bun:test"
import { $ } from "bun"
import { temporaryDirectory } from "tempy"
import { join } from "path"
import { existsSync } from "fs"

test("tsci export gerbers --input example-project/examples/macrokeypad.tsx", async () => {
  const tempDir = temporaryDirectory()
  const { stdout, stderr } =
    await $`bun cli/cli.ts export gerbers --input example-project/examples/macrokeypad.tsx --outputfile ${join(tempDir, "gerbers.zip")}`

  expect(stderr.toString()).toBe("")
  expect(stdout.toString()).toContain("gerbers.zip")

  expect(existsSync(join(tempDir, "gerbers.zip"))).toBe(true)
})
