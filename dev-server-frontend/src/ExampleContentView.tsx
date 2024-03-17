import { useQuery } from "react-query"
import { useGlobalStore } from "./hooks/use-global-store"
import axios from "axios"
import { Schematic } from "@tscircuit/schematic-viewer"
import { PCBViewer } from "@tscircuit/pcb-viewer"
import { cn } from "./lib/utils"

export const ExampleContentView = () => {
  const devExamplePackageId = useGlobalStore(
    (s) => s.active_dev_example_package_id
  )

  const { data: pkg } = useQuery(
    ["dev_package_example", devExamplePackageId],
    async () =>
      axios
        .post(`/api/dev_package_examples/get`, {
          dev_package_example_id: devExamplePackageId,
        })
        .then((r) => r.data.dev_package_example)
  )

  const viewMode = useGlobalStore((s) => s.view_mode)
  const splitMode = useGlobalStore((s) => s.split_mode)

  const editorHeight = window.innerHeight - 52
  const halfHeight = Math.floor(editorHeight / 2)

  const itemHeight =
    viewMode === "split" && splitMode === "vertical" ? halfHeight : editorHeight

  return (
    <div
      key={pkg?.last_updated_at}
      className={cn(
        `h-[${editorHeight}px]`,
        viewMode === "split" &&
          splitMode === "horizontal" &&
          "grid grid-cols-2",
        viewMode === "split" && splitMode === "vertical" && "grid grid-rows-2"
      )}
    >
      {pkg && (viewMode === "schematic" || viewMode === "split") && (
        <Schematic
          key={pkg?.last_updated_at}
          style={{ height: itemHeight }}
          soup={pkg.tscircuit_soup}
          showTable={false}
        />
      )}
      {pkg && (viewMode === "pcb" || viewMode === "split") && (
        <PCBViewer
          key={pkg?.last_updated_at}
          height={itemHeight}
          soup={pkg.tscircuit_soup}
        />
      )}
    </div>
  )
}
