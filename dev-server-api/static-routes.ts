
// import { WinterSpecRouteMap } from "@winterspec/types"

const routeMap = {
  "/api/db/download": (await import('routes/api/db/download.ts')).default,
  "/api/dev_package_examples/create": (await import('routes/api/dev_package_examples/create.ts')).default,
  "/api/dev_package_examples/get": (await import('routes/api/dev_package_examples/get.ts')).default,
  "/api/dev_package_examples/list": (await import('routes/api/dev_package_examples/list.ts')).default,
  "/api/dev_package_examples/update": (await import('routes/api/dev_package_examples/update.ts')).default,
  "/api/dev_server/reset": (await import('routes/api/dev_server/reset.ts')).default,
  "/api/export_files/create": (await import('routes/api/export_files/create.ts')).default,
  "/api/export_files/download": (await import('routes/api/export_files/download.ts')).default,
  "/api/export_requests/create": (await import('routes/api/export_requests/create.ts')).default,
  "/api/export_requests/get": (await import('routes/api/export_requests/get.ts')).default,
  "/api/export_requests/list": (await import('routes/api/export_requests/list.ts')).default,
  "/api/export_requests/update": (await import('routes/api/export_requests/update.ts')).default,
  "/api/health": (await import('routes/api/health.ts')).default,
  "/api/package_info/create": (await import('routes/api/package_info/create.ts')).default,
  "/api/package_info/get": (await import('routes/api/package_info/get.ts')).default,
  "/health": (await import('routes/health.ts')).default,
  "/": (await import('routes/index.ts')).default
}

export default routeMap
