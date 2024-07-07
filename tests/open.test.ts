import { test, expect } from "bun:test"
import { $ } from "bun"

test("tsci open", async () => {
  const result = await $`bun cli.ts open -y --cwd ./example-project`.text()
  expect(result).toContain("http")
  expect(result).toContain("example-project")
})
