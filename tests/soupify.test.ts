import { test, expect, describe } from "bun:test"
import { $ } from "bun"

test("soupify", async () => {
  const result =
    await $`bun cli.ts soupify -y --file ./example-project/examples/basic-bug.tsx`.text()

  expect(result).toContain("10kohm")
})
