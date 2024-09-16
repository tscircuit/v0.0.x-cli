import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import { useQuery } from "react-query"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "frontend/components/ui/menubar"
import cliPackageJson from "../../package.json"
import { useGenericExportDialog } from "frontend/components/dialogs/generic-export-dialog"
import { useGerberExportDialog } from "frontend/components/dialogs/gerber-export-dialog"
import { useGlobalStore } from "frontend/hooks/use-global-store"

const DEBUG_URL = "https://debug.tscircuit.com"

export const HeaderMenu = () => {
  const [viewMode, setViewMode] = useGlobalStore((s) => [
    s.view_mode,
    s.setViewMode,
  ])
  const [splitMode, setSplitMode] = useGlobalStore((s) => [
    s.split_mode,
    s.setSplitMode,
  ])
  const devExamplePackageId = useGlobalStore(
    (s) => s.active_dev_example_package_id,
  )

  const { data, isLoading } = useQuery(
    ["package_info"],
    async () => axios.get("/api/package_info/get"),
    {
      refetchOnWindowFocus: true,
      retry: false,
    },
  )

  const name = data?.data.package_info.name

  const [inDebugMode, setInDebugMode] = useState(false)
  const gerberExportDialog = useGerberExportDialog()
  const pnpExportDialog = useGenericExportDialog({
    dialogTitle: "Export Pick'n'Place",
    dialogDescription:
      "Export the Pick'n'Place CSV for this example export. You can upload this to an assembler (PCBA) to tell their machines where to place each component.",
    exportFileName: "pnp.csv",
    exportParameters: {
      should_export_pnp_csv: true,
    },
  })
  const bomExportDialog = useGenericExportDialog({
    dialogTitle: "Export Bill of Materials",
    dialogDescription:
      "Export the Bill of Materials CSV for this example export. You can upload this to an assembler (PCBA) so they know how to source each component.",
    exportFileName: "bom.csv",
    exportParameters: {
      should_export_bom_csv: true,
    },
  })
  const soupExportDialog = useGenericExportDialog({
    dialogTitle: "Export tscircuit Soup",
    dialogDescription:
      "Export the tscircuit soup for this example export. This is an internal compiled JSON representation of your circuit.",
    exportFileName: "soup.json",
    exportParameters: {
      should_export_soup_json: true,
    },
  })

  const handleDebugClick = async () => {
    const soupData = await axios
      .post("/api/dev_package_examples/get", {
        dev_package_example_id: devExamplePackageId,
      })
      .then((r) => r.data.dev_package_example.tscircuit_soup)

    // logSoup module is giving cors error
    await axios.post(
      `${DEBUG_URL}/api/soup_group/add_soup`,
      {
        soup_group_name: name,
        soup_name: name,
        username: "tmp",
        content: {
          elements: soupData,
        },
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      },
    )
  }

  return (
    <>
      <Menubar className="border-none shadow-none">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent className="z-[200]">
            <MenubarItem disabled>{name}</MenubarItem>
            <MenubarSeparator />
            <MenubarItem
              onSelect={() => {
                toast.error("Not yet implemented!")
              }}
            >
              New Circuit
            </MenubarItem>
            <MenubarItem
              onSelect={() => {
                handleDebugClick()
              }}
            >
              Debug
            </MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Export</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem onSelect={() => gerberExportDialog.openDialog()}>
                  Gerbers
                </MenubarItem>
                <MenubarItem onSelect={() => pnpExportDialog.openDialog()}>
                  Pick'n'Place CSV
                </MenubarItem>
                <MenubarItem onSelect={() => bomExportDialog.openDialog()}>
                  Bill of Materials CSV
                </MenubarItem>
                <MenubarItem
                  onSelect={() => {
                    toast.error("Not yet implemented!")
                  }}
                >
                  Netlist
                </MenubarItem>
                <MenubarItem
                  onSelect={() => {
                    toast.error("Not yet implemented!")
                  }}
                >
                  Schematic (PDF)
                </MenubarItem>
                <MenubarItem onSelect={() => soupExportDialog.openDialog()}>
                  Circuit JSON
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent className="z-[200]">
            <MenubarRadioGroup
              value={viewMode}
              onValueChange={(v) => setViewMode(v as any)}
            >
              <MenubarRadioItem value="schematic">Schematic</MenubarRadioItem>
              <MenubarRadioItem value="pcb">PCB</MenubarRadioItem>
              <MenubarRadioItem value="split">Split View</MenubarRadioItem>
              <MenubarRadioItem value="soup">Soup</MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarRadioGroup
              value={viewMode === "split" ? splitMode : "neither"}
              onValueChange={(v) => setSplitMode(v as any)}
            >
              <MenubarRadioItem
                disabled={viewMode !== "split"}
                value="horizontal"
              >
                Horizontal Split
              </MenubarRadioItem>
              <MenubarRadioItem
                disabled={viewMode !== "split"}
                value="vertical"
              >
                Vertical Split
              </MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarCheckboxItem
              checked={inDebugMode}
              onSelect={() => setInDebugMode(!inDebugMode)}
            >
              Debug Mode
            </MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Package</MenubarTrigger>
          <MenubarContent className="z-[200]">
            <MenubarItem disabled>{name}</MenubarItem>
            <MenubarSeparator />
            <MenubarCheckboxItem
              checked
              onSelect={() => toast.error("Not yet implemented!")}
            >
              Published
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              onSelect={() => toast.error("Not yet implemented!")}
            >
              Locked
            </MenubarCheckboxItem>
            <MenubarItem onSelect={() => toast.error("Not yet implemented!")}>
              Publish New Version
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem
              onSelect={() => {
                toast.error("Not yet implemented!")
                // window.open(`https://registry.tscircuit.com/${}`)
              }}
            >
              View on Registry
            </MenubarItem>
            <MenubarItem
              onSelect={() => {
                toast.error("Not yet implemented!")
                // window.open(`https://registry.tscircuit.com/${}`)
              }}
            >
              Edit Registry Settings
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>About</MenubarTrigger>
          <MenubarContent className="z-[200]">
            <MenubarItem
              onSelect={() => {
                window.open("https://github.com/tscircuit/tscircuit", "_blank")
              }}
            >
              Github
            </MenubarItem>
            <MenubarItem
              onSelect={() => {
                toast.error("Not yet implemented!")
              }}
            >
              Tutorials
            </MenubarItem>
            <MenubarItem
              onSelect={() => {
                toast.error("Not yet implemented!")
              }}
            >
              tscircuit.com
            </MenubarItem>
            <MenubarItem
              onSelect={() => {
                toast.error("Not yet implemented!")
              }}
            >
              registry.tscircuit.com
            </MenubarItem>
            <MenubarItem
              onSelect={() => {
                window.open("https://tscircuit.com/changelog", "_blank")
              }}
            >
              Changelog
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem disabled>
              @tscircuit/cli v{cliPackageJson.version}
            </MenubarItem>
            <MenubarItem disabled>
              @tscircuit/builder v
              {cliPackageJson.dependencies?.["@tscircuit/builder"]?.replace(
                /\^/g,
                "",
              )}
            </MenubarItem>
            <MenubarItem disabled>
              @tscircuit/schematic-viewer v
              {cliPackageJson.devDependencies[
                "@tscircuit/schematic-viewer"
              ].replace(/\^/g, "")}
            </MenubarItem>
            <MenubarItem disabled>
              @tscircuit/pcb-viewer v
              {cliPackageJson.devDependencies["@tscircuit/pcb-viewer"].replace(
                /\^/g,
                "",
              )}
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <gerberExportDialog.Component />
      <pnpExportDialog.Component />
      <bomExportDialog.Component />
      <soupExportDialog.Component />
    </>
  )
}
