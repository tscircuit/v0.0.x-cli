import { afterEach } from "bun:test"
import { tmpdir } from "node:os"
import defaultAxios from "redaxios"
import { startServer } from "./start-server"

interface TestFixture {
  url: string
  server: any
  axios: typeof defaultAxios
}

export const getTestFixture = async (): Promise<TestFixture> => {
  process.env.TSCI_DEV_SERVER_DB = tmpdir() + `/${Math.random()}` + "/devdb"
  const port = 3001 + Math.floor(Math.random() * 999)
  const testInstanceId = Math.random().toString(36).substring(2, 15)
  const server = await startServer({ port })
  const url = `http://127.0.0.1:${port}`
  const axios = defaultAxios.create({
    baseURL: url,
  })

  afterEach(() => {
    server.stop()
  })

  return {
    url,
    server,
    axios,
  }
}
