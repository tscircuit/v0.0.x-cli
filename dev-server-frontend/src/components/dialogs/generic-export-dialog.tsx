import { useMemo, useState } from "react"
import { Dialog } from "@headlessui/react"
import { useGlobalStore } from "src/hooks/use-global-store"
import { useActiveDevPackageExampleLite } from "src/hooks/use-active-dev-package-example-lite"
import { Button } from "../ui/button"
import axios from "axios"
import {
  ExportParameters,
  ExportParametersInput,
  export_parameters,
} from "@server/lib/zod/export_parameters"

export const useGenericExportDialog = ({
  exportFileName,
  dialogTitle,
  dialogDescription,
  exportParameters,
}: {
  exportFileName: string
  dialogTitle: string
  dialogDescription: string
  exportParameters: ExportParametersInput
}) => {
  const [open, setIsOpen] = useState(false)
  const activeDevExamplePackage = useActiveDevPackageExampleLite()
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  return useMemo(() => {
    const openDialog = () => {
      setIsOpen(true)
    }
    const closeDialog = () => {
      setIsOpen(false)
      setIsExporting(false)
    }
    if (!activeDevExamplePackage)
      return {
        openDialog,
        closeDialog,
        Component: () => null,
      }
    const { file_path: inputFilePath, export_name: exampleExportName } =
      activeDevExamplePackage
    const outputName = `${
      inputFilePath.split("/").pop()?.split(".")[0]
    }-${exampleExportName}-${exportFileName}`

    return {
      openDialog,
      closeDialog,
      Component: () => (
        <GenericExportDialog
          dialogTitle={dialogTitle}
          dialogDescription={dialogDescription}
          open={open}
          isExporting={isExporting}
          filePath={inputFilePath}
          tsCircuitExportName={exampleExportName}
          outputName={outputName}
          exportError={exportError}
          onClickExport={async () => {
            setExportError(null)
            setIsExporting(true)
            try {
              if (exportParameters.should_export_pnp_csv) {
                exportParameters.pnp_csv_file_name ??= exportFileName
              }
              if (exportParameters.should_export_bom_csv) {
                exportParameters.bom_csv_file_name ??= exportFileName
              }
              if (exportParameters.should_export_soup_json) {
                exportParameters.soup_json_file_name ??= exportFileName
              }

              let export_request = await axios
                .post("/api/export_requests/create", {
                  example_file_path: activeDevExamplePackage.file_path,
                  export_name: activeDevExamplePackage.export_name,
                  export_parameters: exportParameters,
                })
                .then((r) => r.data.export_request)
              const pollExportRequest = async () => {
                while (!export_request.is_complete) {
                  try {
                    export_request = await axios
                      .post("/api/export_requests/get", {
                        export_request_id: export_request.export_request_id,
                      })
                      .then((r) => r.data.export_request)
                  } catch (e: any) {
                    console.error(e)
                    setExportError(
                      `${e.toString()}\n\n${e.response?.data?.error?.message}`
                    )
                    setIsExporting(false)
                    return
                  }
                  await new Promise((resolve) => setTimeout(resolve, 100))
                }
                setIsExporting(false)
              }
              await pollExportRequest()
              // open /api/export_files/download?export_file_id=... in new tab
              const export_file_id =
                export_request.file_summary[0].export_file_id
              window.open(
                `/api/export_files/download?export_file_id=${export_file_id}`,
                "_blank"
              )
              setIsExporting(false)
            } catch (e: any) {
              console.error(e)
              setExportError(
                `${e.toString()}\n\n${e.response?.data?.error?.message}`
              )
              setIsExporting(false)
            }
          }}
          onClose={() => closeDialog()}
        />
      ),
    }
  }, [open, isExporting, exportError])
}

export const GenericExportDialog = ({
  open,
  dialogTitle,
  dialogDescription,
  isExporting,
  filePath,
  tsCircuitExportName,
  outputName,
  exportError,
  onClose,
  onClickExport,
}: {
  open: boolean
  dialogTitle: string
  dialogDescription: string
  filePath: string
  tsCircuitExportName: string
  isExporting: boolean
  outputName: string
  exportError?: string | null
  onClose: (value: boolean) => void
  onClickExport: () => any
}) => {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-[101]">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded bg-white p-6 border border-[rgba(0,0,0,0.3)]">
          <Dialog.Title className="text-lg font-semibold tracking-tight text-black">
            {dialogTitle}
          </Dialog.Title>
          <Dialog.Description className="text-sm font-medium text-muted-foreground">
            {dialogDescription}
          </Dialog.Description>
          {exportError && (
            <div className="text-red-700 bg-red-100 border-red-200 border whitespace-pre-wrap font-mono text-xs p-4 mt-8">
              {exportError}
            </div>
          )}
          <div className="text-xs font-medium grid grid-cols-4 font-mono mt-8 gap-4">
            <div className="text-muted-foreground font-sans">Status</div>
            <div className="col-span-3 text-muted-foreground font-sans">
              {isExporting ? "Exporting" : "Not Started"}
            </div>
            <div className="text-muted-foreground font-sans">File Path</div>
            <div className="col-span-3">{filePath.split("/examples/")[1]}</div>
            <div className="text-muted-foreground  font-sans">Export Name</div>
            <div className="col-span-3">{tsCircuitExportName}</div>
            <div className="text-muted-foreground font-sans">Output Name</div>
            <div className="col-span-3">{outputName}</div>
          </div>
          <div className="flex mt-8 justify-end">
            <Button
              variant={isExporting ? "ghost" : "default"}
              disabled={isExporting}
              onClick={onClickExport}
            >
              {isExporting ? `Exporting...` : `Export`}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
