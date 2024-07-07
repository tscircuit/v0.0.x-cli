import { it, expect } from "bun:test"
import { getTestFixture } from "tests/fixtures/get-test-server"

it("POST /api/dev_package_examples/update", async () => {
  const { axios } = await getTestFixture()

  await axios
    .post("/api/dev_package_examples/create", {
      file_path: "examples/basic-resistor.tsx",
      export_name: "default",
      tscircuit_soup: [],
      is_loading: true,
    })
    .then((r) => r.data)

  const res = await axios
    .post("/api/dev_package_examples/update", {
      dev_package_example_id: 1,
      completed_edit_events: [],
      edit_events_last_applied_at: "2023-01-01T00:00:00.000Z",
    })
    .then((r) => r.data)

  expect(res.dev_package_example.completed_edit_events).toEqual([])
  expect(res.dev_package_example.edit_events_last_applied_at).toEqual(
    "2023-01-01T00:00:00.000Z"
  )
})
