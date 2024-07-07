import { it, expect } from "bun:test"
import { getTestFixture } from "tests/fixtures/get-test-server"

it("POST /api/export_requests/update", async () => {
  const { axios } = await getTestFixture()

  // First, create an export request
  const createRes = await axios.post("/api/export_requests/create", {
    example_file_path: "examples/test-example.tsx",
    export_name: "default",
    export_parameters: { format: "gerber", should_export_gerber_zip: true },
  })

  const exportRequestId = createRes.data.export_request.export_request_id

  // Now, update the export request
  const updateRes = await axios.post("/api/export_requests/update", {
    export_request_id: exportRequestId,
    is_complete: true,
    has_error: false,
  })

  expect(updateRes.status).toBe(200)
  expect(updateRes.data.export_request).toBeDefined()
  expect(updateRes.data.export_request.export_request_id).toBe(exportRequestId)
  expect(updateRes.data.export_request.is_complete).toBe(true)
  expect(updateRes.data.export_request.has_error).toBe(false)

  // // Verify the update
  const getRes = await axios.post(`/api/export_requests/get`, {
    export_request_id: exportRequestId,
  })

  expect(getRes.status).toBe(200)
  expect(getRes.data.export_request.is_complete).toBe(true)
  expect(getRes.data.export_request.has_error).toBe(false)
})

it("POST /api/export_requests/update - Not Found", async () => {
  const { axios } = await getTestFixture()

  try {
    await axios.post("/api/export_requests/update", {
      export_request_id: 999999,
      is_complete: true,
    })
  } catch (error: any) {
    expect(error.status).toBe(404)
  }
})
