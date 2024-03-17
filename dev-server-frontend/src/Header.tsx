import { useState } from "react"
import { SelectExampleSearch } from "./components/select-example-search"
import { Button } from "./components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs"
import { RotateCounterClockwiseIcon } from "@radix-ui/react-icons"
import { useGlobalStore } from "./hooks/use-global-store"
import { HeaderMenu } from "./HeaderMenu"
import { CommandShortcut } from "./components/ui/command"

export const Header = () => {
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
    <div className="p-2 border-b border-b-gray-200 shadow-sm grid grid-cols-3">
      <div className="flex">
        <div className="inline-flex">
          <HeaderMenu />
        </div>
      </div>
      <div className="justify-center flex">
        <SelectExampleSearch />
      </div>
      <div className="flex justify-end">
        {/* Tabs from shadcn with "Tab One" and "Tab Two" */}
        <Tabs onValueChange={(v) => setViewMode(v as any)} value={viewMode}>
          <TabsList>
            <TabsTrigger value="schematic">Schematic</TabsTrigger>
            <TabsTrigger value="pcb">PCB</TabsTrigger>
            <TabsTrigger value="split">Split</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button
          variant="outline"
          disabled={viewMode !== "split"}
          className="ml-1 group"
          onClick={() => {
            setSplitMode(splitMode === "horizontal" ? "vertical" : "horizontal")
          }}
        >
          <RotateCounterClockwiseIcon className="scale-x-[-1] group-hover:rotate-[30deg] transition-transform" />
        </Button>
      </div>
    </div>
  )
}
