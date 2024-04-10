import { useDevPackageExamples } from "./use-dev-package-examples"
import { useGlobalStore } from "./use-global-store"

export function inflatePackageExample(ex: any): {
  dev_package_example_id: number
  searchable_id: string
  file_path: string
  expath: string
  export_name: string
  last_updated_at: string
} {
  if (!ex) return ex
  return {
    ...ex,
    expath: ex.file_path.replace(/.*examples\//, ""),
    searchable_id: `${ex.file_path.replace(/.*examples\//, "")} | ${
      ex.export_name
    }`,
  }
}

export const useActiveDevPackageExampleLite = () => {
  const { data: examples } = useDevPackageExamples()

  const [active_dev_example_package_id, setActiveDevExamplePackageId] =
    useGlobalStore((s) => [
      s.active_dev_example_package_id,
      s.setActiveDevExamplePackageId,
    ])

  const activeDevExamplePackage = inflatePackageExample(
    examples?.find(
      (ex) =>
        ex.dev_package_example_id.toString() === active_dev_example_package_id
    )
  )

  return activeDevExamplePackage
}
