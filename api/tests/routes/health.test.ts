import { it, expect } from "bun:test"
import { getTestFixture } from "../fixtures/get-test-server"

it("GET /health", async () => {
  const { axios } = await getTestFixture()

  expect(await axios.get("/health").then((r) => r.data)).toMatchObject({
    ok: true,
  })
})
