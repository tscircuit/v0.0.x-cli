import apiServer from "../../../dev-server-api"
import frontendVfs from "../../../dev-server-frontend/dist/bundle"
import EdgeRuntimePrimitives from "@edge-runtime/primitives"
import mime from "mime-types"

/**
 * Handles all requests to :3020, then proxies...
 * 
 * /api/* : to the api server
 * /*     : to the static frontend bundle inside dev-server-frontend
 * 
 */
export const devServerRequestHandler = async (bunReq: Request) => {
  const url = new URL(bunReq.url)
  const requestType = url.pathname.startsWith("/api")
    ? "api"
    : url.pathname.startsWith("/preview")
      ? "preview"
      : "other"

  if (requestType === "api") {
    // We have to shim Bun's Request until they fix the issue where
    // .clone() doesn't clone the body
    // https://github.com/oven-sh/bun/pull/8668
    const req = new EdgeRuntimePrimitives.Request(bunReq.url, {
      headers: bunReq.headers,
      method: bunReq.method,
      body: bunReq.body,
    })

    const response = await apiServer.makeRequest(req as any, {})
    return response
  } else if (requestType === "preview") {
    let frontendPath = url.pathname.replace("/preview", "")
    if (frontendPath === "/" || frontendPath === "") {
      frontendPath = "index.html"
    }
    frontendPath = frontendPath.replace(/^\//, "")

    const fileContent: Buffer = (frontendVfs as any)[frontendPath]
    if (!fileContent) {
      return new Response("Not Found", { status: 404 })
    }
    return new Response(
      // Buffer.from(fileContent.toString(), "base64").toString("utf-8"),
      fileContent.toString("utf-8"),
      {
        headers: {
          "Content-Type": mime.lookup(frontendPath) || "text/plain",
        },
      }
    )
  } else {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/preview",
      },
    })
  }
}
