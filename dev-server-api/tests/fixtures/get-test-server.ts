import { afterEach } from "bun:test"
import defaultAxios from "redaxios"
import { startServer } from "./start-server"

interface TestFixture {
  url: string
  server: any
  axios: typeof defaultAxios
}

export const getTestFixture = async (): Promise<TestFixture> => {
  const port = 3001 + Math.floor(Math.random() * 999)
  const server = startServer({ port })
  const url = `http://localhost:${port}`
  const axios = defaultAxios.create({
    baseURL: url,
  })

  afterEach(() => {
    console.log("closing server")
    server.stop()
  })

  return {
    url,
    server,
    axios,
  }
}
