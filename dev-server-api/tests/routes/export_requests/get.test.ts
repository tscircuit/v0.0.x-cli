import { it, expect } from "bun:test"
import { getTestFixture } from "tests/fixtures/get-test-server"

it("GET /api/export_requests/get", async () => {
  const { axios } = await getTestFixture()

  // First, create an export request
  const createRes = await axios.post("/api/export_requests/create", {
    example_file_path: "examples/test-example.tsx",
    export_name: "default",
    export_parameters: { should_export_gerber_zip: true },
  })

  const exportRequestId = createRes.data.export_request.export_request_id

  // Now, get the export request
  const getRes = await axios.post(`/api/export_requests/get`, {
    export_request_id: exportRequestId,
  })

  expect(getRes.status).toBe(200)
  expect(getRes.data.export_request).toBeDefined()
  expect(getRes.data.export_request.export_request_id).toBe(exportRequestId)
  expect(getRes.data.export_request.example_file_path).toBe(
    "examples/test-example.tsx"
  )
  expect(getRes.data.export_request.export_name).toBe("default")
  expect(getRes.data.export_request.export_parameters).toMatchObject({
    should_export_gerber_zip: true,
  })
})

it("GET /api/export_requests/get - Not Found", async () => {
  const { axios } = await getTestFixture()

  try {
    await axios.post("/api/export_requests/get", { export_request_id: 999999 })
  } catch (error: any) {
    expect(error.status).toBe(404)
  }
})
