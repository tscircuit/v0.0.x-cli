import { it, expect } from "bun:test"
import { getTestFixture } from "tests/fixtures/get-test-server"

it("GET /api/export_requests/list", async () => {
  const { axios } = await getTestFixture()

  // Create two export requests
  await axios.post("/api/export_requests/create", {
    example_file_path: "examples/test-example1.tsx",
    export_name: "default",
    export_parameters: { format: "gerber" },
  })

  await axios.post("/api/export_requests/create", {
    example_file_path: "examples/test-example2.tsx",
    export_name: "default",
    export_parameters: { format: "svg" },
  })

  // List all export requests
  const listRes = await axios.post("/api/export_requests/list", {})

  expect(listRes.status).toBe(200)
  expect(listRes.data.export_requests).toBeDefined()
  expect(Array.isArray(listRes.data.export_requests)).toBe(true)

  // List completed export requests (should be empty)
  const completedRes = await axios.post("/api/export_requests/list", {
    is_complete: true,
  })

  expect(completedRes.status).toBe(200)
  expect(completedRes.data.export_requests).toBeDefined()
  expect(Array.isArray(completedRes.data.export_requests)).toBe(true)
})
