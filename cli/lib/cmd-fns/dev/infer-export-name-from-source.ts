export const inferExportNameFromSource = (sourceContent: string): string => {
  if (sourceContent.includes("export default")) {
    return "default"
  }
  const matches = Array.from(
    sourceContent.matchAll(/export\s+(const|function)\s+([A-Z]\w+)\s*=?/g),
  ).map((m) => m[2])
  if (matches.length === 0) {
    throw new Error(`No export detected in "${sourceContent}"`)
  }
  if (matches.length > 1) {
    throw new Error(
      `Multiple exports detected in "${sourceContent}", only single exports currently working`,
    )
  }
  return matches[0]
}
