import { test, expect, describe } from "bun:test"
import { $ } from "bun"

test("soupify (builder)", async () => {
  const result =
    await $`bun cli/cli.ts soupify -y --file ./example-project/examples/basic-chip.tsx`.text()

  expect(result).toContain("10kohm")
})
