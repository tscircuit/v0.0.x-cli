"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { useQuery } from "react-query"
import axios from "axios"

import { cn } from "src/lib/utils"
import { Button } from "src/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "src/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/ui/popover"
import { useGlobalStore } from "src/hooks/use-global-store"

export const useDevPackageExamples = () => {
  return useQuery("examples", async () => {
    const { data } = await axios.get("/api/dev_package_examples/list")
    return data.dev_package_examples.map(inflatePackageExample) as Array<{
      dev_package_example_id: number
      searchable_id: string
      file_path: string
      expath: string
      export_name: string
      last_updated_at: string
    }>
  })
}

function inflatePackageExample(ex: any) {
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

  const activeDevExamplePackage = inflatePackageExample(
    examples?.find(
      (ex) =>
        ex.dev_package_example_id.toString() === active_dev_example_package_id
    )
  )

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
      <PopoverContent className="w-[400px] p-0">
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
                      example.dev_package_example_id.toString()
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
