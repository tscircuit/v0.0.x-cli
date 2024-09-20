import Path from "node:path"
import fs from "fs/promises"

export const getTmpEntrypointFilePath = async (filePath: string) => {
  const tmpEntrypointPath = Path.resolve(
    Path.dirname(filePath),
    Path.basename(filePath).replace(/\.[^\.]+$/, "") + ".__tmp_entrypoint.tsx",
  )
  const tmpOutputPath = Path.resolve(
    Path.dirname(filePath),
    Path.basename(filePath).replace(/\.[^\.]+$/, "") + ".__tmp_output.json",
  )

  return { tmpEntrypointPath, tmpOutputPath }
}
