import { useQuery } from "react-query"
import { useGlobalStore } from "./hooks/use-global-store"
import axios from "axios"
import { Schematic } from "@tscircuit/schematic-viewer"
import { PCBViewer } from "@tscircuit/pcb-viewer"
import { cn } from "./lib/utils"
import { ErrorBoundary } from "react-error-boundary"
import { SoupTableViewer } from "@tscircuit/table-viewer"
import "react-data-grid/lib/styles.css"
import { useEffect, useRef, useState } from "react"
import type { EditEvent } from "@tscircuit/pcb-viewer"
import { CadViewer } from "@tscircuit/3d-viewer"

export const ExampleContentView = () => {
  const devExamplePackageId = useGlobalStore(
    (s) => s.active_dev_example_package_id,
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
    },
  )

  const sentEditEvents = useRef<Record<string, boolean>>({})

  const notFound = (error as any)?.response?.status === 404

  const viewMode = useGlobalStore((s) => s.view_mode)
  const splitMode = useGlobalStore((s) => s.split_mode)
  // eslint-disable-next-line prefer-const
  let [editEvents, setEditEvents] = useState<EditEvent[]>([])

  editEvents = editEvents.filter(
    (ee) =>
      ee.created_at > new Date(pkg?.edit_events_last_applied_at).valueOf(),
  )

  const editorHeight = window.innerHeight - 52
  const halfHeight = Math.floor(editorHeight / 2)

  const itemHeight =
    viewMode === "split" && splitMode === "vertical" ? halfHeight : editorHeight

  return (
    <div
      key={pkg?.soup_last_updated_at}
      className={cn(
        "relative",
        `h-[${editorHeight}px]`,
        viewMode === "split" &&
        splitMode === "horizontal" &&
        "grid grid-cols-2",
        viewMode === "split" && splitMode === "vertical" && "grid grid-rows-2",
      )}
    >
      {pkg && (viewMode === "schematic" || viewMode === "split") && (
        <ErrorBoundary fallback={<div>Failed to render Schematic</div>}>
          <Schematic
            key={`sch-${pkg?.soup_last_updated_at}`}
            style={{ height: itemHeight }}
            soup={pkg.tscircuit_soup}
            showTable={false}
          />
        </ErrorBoundary>
      )}
      {pkg && (viewMode === "pcb" || viewMode === "split") && (
        <ErrorBoundary fallback={<div>Failed to render PCB</div>}>
          <PCBViewer
            key={`pcb-${pkg?.soup_last_updated_at}`}
            height={itemHeight}
            allowEditing
            editEvents={editEvents}
            onEditEventsChanged={(changedEditEvents) => {
              // Look for any edit events that have not been sent to the server
              // and send them, then mark them as sent
              let hasUnsentEditEvents = false
              for (const editEvent of changedEditEvents) {
                if (
                  !editEvent.in_progress &&
                  !sentEditEvents.current[editEvent.edit_event_id]
                ) {
                  hasUnsentEditEvents = true
                  sentEditEvents.current[editEvent.edit_event_id] = true
                }
              }
              if (hasUnsentEditEvents) {
                axios.post(`/api/dev_package_examples/update`, {
                  dev_package_example_id: devExamplePackageId,
                  completed_edit_events: changedEditEvents.filter(
                    (ee) => ee.in_progress === false,
                  ),
                })
              }
              setEditEvents(changedEditEvents)
            }}
            soup={pkg.tscircuit_soup}
          />
        </ErrorBoundary>
      )}
      {pkg && viewMode === "3d" && (
        <ErrorBoundary
          fallbackRender={(props) => (
            <div style={{ padding: 20 }}>
              Failed to render 3d view
              <div style={{ marginTop: 20, color: "red" }}>
                {props.error.message}
              </div>
            </div>
          )}
        >
          <div style={{ height: itemHeight }}>
            <CadViewer soup={pkg.tscircuit_soup} />
          </div>
        </ErrorBoundary>
      )}
      {pkg && viewMode === "soup" && (
        <ErrorBoundary fallback={<div>Failed to render Soup</div>}>
          <SoupTableViewer
            key={`soup-${pkg?.soup_last_updated_at}`}
            height={itemHeight}
            elements={pkg.tscircuit_soup}
            appearance="dark"
          />
        </ErrorBoundary>
      )}
      {pkg?.error && viewMode !== "soup" && (
        <div className="absolute top-0 w-full">
          <div className="p-4 m-16 whitespace-pre border border-red-200 rounded-lg shadow-lg bg-red-50">
            {pkg?.error}
          </div>
        </div>
      )}
      {notFound && (
        <div className="absolute top-0 flex justify-center w-full">
          <div className="bg-yellow-50 shadow-lg p-4 m-16 border-yellow-200 border rounded-lg whitespace-pre max-w-[400px]">
            Select an example from the menu above
          </div>
        </div>
      )}
      {isLoading && !isError && (
        <div className="absolute top-0 flex justify-center w-full">
          <div className="p-4 m-16 whitespace-pre border border-gray-200 rounded-lg shadow-lg bg-gray-50">
            Loading...
          </div>
        </div>
      )}
      {pkg && pkg.is_loading && (
        <div className="absolute top-0 right-0 z-10 flex items-center p-4 py-2 m-4 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="w-4 h-4 mr-2 border-2 border-blue-400 rounded-full border-t-transparent animate-spin"></div>
          Rebuilding...
        </div>
      )}
    </div>
  )
}
