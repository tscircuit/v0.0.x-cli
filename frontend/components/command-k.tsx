import { useEffect, useState } from "react"
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "./ui/command"
import { useGlobalStore } from "src/hooks/use-global-store"
import { useDevPackageExamples } from "../hooks/use-dev-package-examples"
import { CommandSeparator } from "cmdk"

export const CommandK = () => {
  const [open, setOpen] = useState(false)
  const store = useGlobalStore()
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
      if (e.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const { data: examples } = useDevPackageExamples()

  const close = () => {
    setOpen(false)
    return true
  }

  return (
    <CommandDialog open={open} onOpenChange={(open) => setOpen(open)}>
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandGroup heading="Viewing Options">
            <CommandItem
              onSelect={() => close() && store.setViewMode("schematic")}
            >
              View Schematic
              <CommandShortcut></CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => close() && store.setViewMode("pcb")}>
              View PCB
              <CommandShortcut></CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => close() && store.setViewMode("split")}>
              View in Split Mode
              <CommandShortcut></CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => close() && store.setViewMode("split")}>
              Vertical Split
              <CommandShortcut></CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Examples">
            {examples?.map((ex) => (
              <CommandItem
                key={ex.dev_package_example_id}
                value={ex.expath}
                onSelect={() =>
                  close() &&
                  store.setActiveDevExamplePackageId(
                    ex.dev_package_example_id.toString(),
                  )
                }
              >
                {ex.expath}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
