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

export const CommandK = () => {
  const [open, setOpen] = useState(false)
  const store = useGlobalStore()
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const close = () => {
    setOpen(false)
    return true
  }

  return (
    <CommandDialog open={open}>
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Type a command or search..." />
        <CommandGroup>
          <CommandList>
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
          </CommandList>
        </CommandGroup>
      </Command>
    </CommandDialog>
  )
}
