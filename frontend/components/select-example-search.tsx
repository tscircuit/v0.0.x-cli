"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "frontend/lib/utils"
import { Button } from "frontend/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "frontend/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "frontend/components/ui/popover"
import { useGlobalStore } from "frontend/hooks/use-global-store"
import { useDevPackageExamples } from "../hooks/use-dev-package-examples"
import { useActiveDevPackageExampleLite } from "frontend/hooks/use-active-dev-package-example-lite"

export function inflatePackageExample(ex: any) {
  if (!ex) return ex
  return {
    ...ex,
    expath: ex.file_path.replace(/.*examples\//, ""),
    searchable_id: `${ex.file_path.replace(/.*examples\//, "")} | ${
      ex.export_name
    }`,
  }
}

export const SelectExampleSearch = () => {
  const [open, setOpen] = React.useState(false)
  const { data: examples } = useDevPackageExamples()
  const [active_dev_example_package_id, setActiveDevExamplePackageId] =
    useGlobalStore((s) => [
      s.active_dev_example_package_id,
      s.setActiveDevExamplePackageId,
    ])

  const activeDevExamplePackage = useActiveDevPackageExampleLite()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "o" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <div>
            {activeDevExamplePackage
              ? activeDevExamplePackage.expath
              : "Select Circuit"}
          </div>
          <CommandShortcut>
            <kbd>⌘O</kbd>
          </CommandShortcut>
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 z-[101]">
        <Command value={active_dev_example_package_id ?? "none"}>
          <CommandInput placeholder="Search for circuit..." className="h-9" />
          <CommandList>
            <CommandEmpty>
              <div className="text-gray-600 mt-8">
                No matching circuits in{" "}
                <span className="font-mono bg-gray-100 py-0.5 px-1 rounded-sm">
                  ./examples
                </span>
              </div>
              <Button className="mt-12 mb-8">Create Circuit</Button>
            </CommandEmpty>
            <CommandGroup>
              {examples?.map((example) => (
                <CommandItem
                  key={example.dev_package_example_id}
                  value={example.searchable_id}
                  onSelect={() => {
                    setActiveDevExamplePackageId(
                      example.dev_package_example_id.toString(),
                    )
                    setOpen(false)
                  }}
                  className="flex justify-between cursor-pointer hover:bg-gray-100"
                >
                  <div className="text-gray-800">{example.expath}</div>
                  <div className="font-mono text-xs text-gray-600">
                    {example.export_name}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
