import { afterEach } from "bun:test"
import defaultAxios from "redaxios"
import { startServer } from "./start-server"
import { tmpdir } from "node:os"

interface TestFixture {
  url: string
  server: any
  axios: typeof defaultAxios
}

export const getTestFixture = async (): Promise<TestFixture> => {
  process.env.TSCI_DEV_SERVER_DB = tmpdir() + `/${Math.random()}` + "/devdb"
  const port = 3001 + Math.floor(Math.random() * 999)
  const server = startServer({ port })
  const url = `http://localhost:${port}`
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
