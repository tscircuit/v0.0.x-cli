import { it, expect } from "bun:test"
import { getTestFixture } from "tests/fixtures/get-test-server"

it("POST /api/export_requests/create", async () => {
  const { axios } = await getTestFixture()

  const res = await axios.post("/api/export_requests/create", {
    example_file_path: "examples/test-example.tsx",
    export_name: "default",
    export_parameters: { should_export_gerber_zip: true },
  })

  expect(res.status).toBe(200)
  expect(res.data.export_request).toBeDefined()
  expect(res.data.export_request.example_file_path).toBe(
    "examples/test-example.tsx"
  )
  expect(res.data.export_request.export_name).toBe("default")
  expect(res.data.export_request.export_parameters).toMatchObject({
    should_export_gerber_zip: true,
  })
  expect(res.data.export_request.is_complete).toBe(false)
  expect(res.data.export_request.has_error).toBe(false)
})
