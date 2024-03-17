import { test, expect, describe } from "bun:test"
import { $ } from "bun"

test.skip("tsci init", async () => {
  await $`rm -rf ./tests/example-init`
  console.log(
    await $`bun cli.ts init --name init-test --dir ./tests/example-init`.text()
  )
})
