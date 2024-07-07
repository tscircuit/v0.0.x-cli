import { it, expect } from "bun:test"
import { getTestFixture } from "tests/fixtures/get-test-server"

it("POST /api/export_files/create", async () => {
  const { axios } = await getTestFixture()

  const res = await axios
    .post("/api/export_files/create", {
      export_request_id: 1,
      file_name: "test.png",
      file_content_base64:
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    })
    .then((r) => r.data)

  expect(res.export_file.export_request_id).toEqual(1)
  expect(res.export_file.file_name).toEqual("test.png")
})
