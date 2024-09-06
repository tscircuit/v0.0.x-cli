import Path from "node:path"

export const getTmpEntrypointFilePath = (filePath: string) => {
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
