import { test, expect } from "bun:test"
import { $ } from "bun"

test("soupify", async () => {
  const result =
    await $`bun cli.ts open -y --cwd ./tests/assets/example-project`.text()

  expect(result).toContain("http")
    expect(result).toContain("example-project")
})
