import { it, expect } from "bun:test"
import { getTestFixture } from "tests/fixtures/get-test-server"

it("POST /api/dev_package_examples/create", async () => {
  const { axios } = await getTestFixture()

  const res = await axios
    .post("/api/dev_package_examples/create", {
      file_path: "examples/basic-resistor.tsx",
      export_name: "default",
      tscircuit_soup: [],
      is_loading: true,
    })
    .then((r) => r.data)

  expect(res.dev_package_example.file_path).toEqual(
    "examples/basic-resistor.tsx"
  )
})
