import { createWinterSpecBundleFromDir } from "winterspec/adapters/node"
import { join } from "node:path"

export default await createWinterSpecBundleFromDir(
  join(import.meta.dir, "./routes")
)
