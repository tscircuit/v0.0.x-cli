import { useQuery } from "react-query"
import { useGlobalStore } from "./hooks/use-global-store"
import axios from "axios"
import { Schematic } from "@tscircuit/schematic-viewer"
import { PCBViewer } from "@tscircuit/pcb-viewer"
import { cn } from "./lib/utils"
import { ErrorBoundary } from "react-error-boundary"
import { SoupTableViewer } from "@tscircuit/table-viewer"
import "react-data-grid/lib/styles.css"

export const ExampleContentView = () => {
  const devExamplePackageId = useGlobalStore(
    (s) => s.active_dev_example_package_id
  )

  const {
    data: pkg,
    error,
    isError,
    isLoading,
  } = useQuery(
    ["dev_package_example", devExamplePackageId],
    async () =>
      axios
        .post(`/api/dev_package_examples/get`, {
          dev_package_example_id: devExamplePackageId,
        })
        .then((r) => r.data.dev_package_example),
    {
      refetchInterval: 5_000,
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: true,
      retry: false,
    }
  )

  const notFound = (error as any)?.response?.status === 404

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
        "relative",
        `h-[${editorHeight}px]`,
        viewMode === "split" &&
          splitMode === "horizontal" &&
          "grid grid-cols-2",
        viewMode === "split" && splitMode === "vertical" && "grid grid-rows-2"
      )}
    >
      {pkg && (viewMode === "schematic" || viewMode === "split") && (
        <ErrorBoundary fallback={<div>Failed to render Schematic</div>}>
          <Schematic
            key={`sch-${pkg?.last_updated_at}`}
            style={{ height: itemHeight }}
            soup={pkg.tscircuit_soup}
            showTable={false}
          />
        </ErrorBoundary>
      )}
      {pkg && (viewMode === "pcb" || viewMode === "split") && (
        <ErrorBoundary fallback={<div>Failed to render PCB</div>}>
          <PCBViewer
            key={`pcb-${pkg?.last_updated_at}`}
            height={itemHeight}
            allowEditing
            onEditEventsChanged={() => {}}
            soup={pkg.tscircuit_soup}
          />
        </ErrorBoundary>
      )}
      {pkg && viewMode === "soup" && (
        <ErrorBoundary fallback={<div>Failed to render Soup</div>}>
          <SoupTableViewer
            key={`soup-${pkg?.last_updated_at}`}
            height={itemHeight}
            elements={pkg.tscircuit_soup}
            appearance="dark"
          />
        </ErrorBoundary>
      )}
      {pkg?.error && viewMode !== "soup" && (
        <div className="absolute top-0 w-full">
          <div className="bg-red-50 shadow-lg p-4 m-16 border-red-200 border rounded-lg whitespace-pre">
            {pkg?.error}
          </div>
        </div>
      )}
      {notFound && (
        <div className="absolute top-0 w-full flex justify-center">
          <div className="bg-yellow-50 shadow-lg p-4 m-16 border-yellow-200 border rounded-lg whitespace-pre max-w-[400px]">
            Select an example from the menu above
          </div>
        </div>
      )}
      {isLoading && !isError && (
        <div className="absolute top-0 w-full flex justify-center">
          <div className="bg-gray-50 shadow-lg p-4 m-16 border-gray-200 border rounded-lg whitespace-pre">
            Loading...
          </div>
        </div>
      )}
      {pkg && pkg.is_loading && (
        <div className="absolute top-0 right-0 bg-white p-4 py-2 m-4 rounded-md flex items-center z-10 shadow-lg border border-gray-200">
          <div className="border-2 border-blue-400 border-t-transparent rounded-full w-4 h-4 animate-spin mr-2"></div>
          Rebuilding...
        </div>
      )}
    </div>
  )
}
