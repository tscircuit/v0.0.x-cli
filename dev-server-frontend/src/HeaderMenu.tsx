import { useState } from "react"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarCheckboxItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "src/components/ui/menubar"
import toast from "react-hot-toast"
import { useGlobalStore } from "./hooks/use-global-store"
import packageJson from "../package.json"
import cliPackageJson from "../../package.json"

export const HeaderMenu = () => {
  const [viewMode, setViewMode] = useGlobalStore((s) => [
    s.view_mode,
    s.setViewMode,
  ])
  const [splitMode, setSplitMode] = useGlobalStore((s) => [
    s.split_mode,
    s.setSplitMode,
  ])
  const [inDebugMode, setInDebugMode] = useState(false)

  return (
    <Menubar className="border-none shadow-none">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem disabled>seveibar/arduino@1.0.0</MenubarItem>
          <MenubarSeparator />
          <MenubarItem
            onSelect={() => {
              toast.error("Not yet implemented!")
            }}
          >
            New Circuit
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Export</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem
                onSelect={() => {
                  toast.error("Not yet implemented!")
                }}
              >
                Gerbers
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
                PNG
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup
            value={viewMode}
            onValueChange={(v) => setViewMode(v as any)}
          >
            <MenubarRadioItem value="schematic">Schematic</MenubarRadioItem>
            <MenubarRadioItem value="pcb">PCB</MenubarRadioItem>
            <MenubarRadioItem value="split">Split View</MenubarRadioItem>
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
            <MenubarRadioItem disabled={viewMode !== "split"} value="vertical">
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
        <MenubarContent>
          <MenubarItem disabled>seveibar/arduino@1.0.0</MenubarItem>
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
        <MenubarContent>
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
            {cliPackageJson.dependencies["@tscircuit/builder"].replace(
              /\^/g,
              ""
            )}
          </MenubarItem>
          <MenubarItem disabled>
            @tscircuit/react-fiber v
            {cliPackageJson.dependencies["@tscircuit/react-fiber"].replace(
              /\^/g,
              ""
            )}
          </MenubarItem>
          <MenubarItem disabled>
            @tscircuit/schematic-viewer v
            {packageJson.dependencies["@tscircuit/schematic-viewer"].replace(
              /\^/g,
              ""
            )}
          </MenubarItem>
          <MenubarItem disabled>
            @tscircuit/pcb-viewer v
            {packageJson.dependencies["@tscircuit/pcb-viewer"].replace(
              /\^/g,
              ""
            )}
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
