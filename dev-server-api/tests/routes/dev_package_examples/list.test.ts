import { it, expect } from "bun:test"
import { getTestFixture } from "tests/fixtures/get-test-server"

it("GET /api/dev_package_examples/list", async () => {
  const { axios } = await getTestFixture()

  // First, create a dev package example
  await axios.post("/api/dev_package_examples/create", {
    file_path: "examples/test-example.tsx",
    export_name: "default",
    tscircuit_soup: [],
    is_loading: false,
  })

  // Then, list all dev package examples
  const res = await axios
    .post("/api/dev_package_examples/list")
    .then((r) => r.data)

  expect(res.dev_package_examples).toBeDefined()
  expect(Array.isArray(res.dev_package_examples)).toBe(true)
  expect(res.dev_package_examples.length).toBeGreaterThan(0)

  const example = res.dev_package_examples.find(
    (e: any) => e.file_path === "examples/test-example.tsx"
  )
  expect(example).toBeDefined()
  expect(example.export_name).toBe("default")
  expect(example.is_loading).toBe(false)
  expect(example.dev_package_example_id).toBeDefined()
  expect(example.last_updated_at).toBeDefined()
})
