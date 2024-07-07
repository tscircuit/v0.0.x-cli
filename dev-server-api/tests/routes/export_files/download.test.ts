import { it, expect } from "bun:test"
import { getTestFixture } from "tests/fixtures/get-test-server"

it("GET /api/export_files/download", async () => {
  const { axios } = await getTestFixture()

  const exampleBase64 = Buffer.from("example").toString("base64")

  const res = await axios
    .post("/api/export_files/create", {
      export_request_id: 1,
      file_name: "test.png",
      file_content_base64: exampleBase64,
    })
    .then((r) => r.data)

  const downloadRes = await axios
    .get(
      `/api/export_files/download?export_file_id=${res.export_file.export_file_id}`
    )
    .then((r) => r.data)

  // Convert downloadRes to base64 string
  const downloadResBase64 = Buffer.from(downloadRes, "binary").toString(
    "base64"
  )

  expect(downloadResBase64).toEqual(exampleBase64)
})
