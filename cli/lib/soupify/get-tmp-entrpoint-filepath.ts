import Path from "node:path"

export const getTmpEntrypointFilePath = (filePath: string) => {
  const tmpEntrypointPath = Path.join(
    Path.dirname(filePath),
    Path.basename(filePath).replace(/\.[^\.]+$/, "") + ".__tmp_entrypoint.tsx",
  )
  const tmpOutputPath = Path.join(
    Path.dirname(filePath),
    Path.basename(filePath).replace(/\.[^\.]+$/, "") + ".__tmp_output.json",
  )
  return { tmpEntrypointPath, tmpOutputPath }
}
