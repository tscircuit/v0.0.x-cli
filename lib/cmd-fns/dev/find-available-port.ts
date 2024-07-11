import net from 'net'

const MAX_PORT = 65535 // Maximum valid port number

export const findAvailablePort = async (startPort: number): Promise<number> => {
  let port = startPort

  while (port <= MAX_PORT) {
    if (!(await isPortInUse(port))) {
      return port
    }
    port++
  }

  throw new Error(`Unable to find an available port in range ${startPort}-${MAX_PORT}`)
}

const isPortInUse = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.once('error', () => {
      resolve(true)
    })
    server.once('listening', () => {
      server.close()
      resolve(false)
    })
    server.listen(port)
  })
}