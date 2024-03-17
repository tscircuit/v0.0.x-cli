import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface GlobalState {
  active_dev_example_package_id: string | null

  view_mode: "schematic" | "pcb" | "split"
  split_mode: "horizontal" | "vertical"
  in_debug_mode: boolean

  setActiveDevExamplePackageId: (id: string) => void
  setViewMode: (mode: "schematic" | "pcb" | "split") => void
  setSplitMode: (mode: "horizontal" | "vertical") => void
  setDebugMode: (mode: boolean) => void
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      active_dev_example_package_id: null,
      view_mode: "schematic",
      split_mode: "horizontal",
      in_debug_mode: false,

      setActiveDevExamplePackageId: (id: string) => {
        set({ active_dev_example_package_id: id })
      },
      setViewMode: (mode: "schematic" | "pcb" | "split") => {
        set({ view_mode: mode })
      },
      setSplitMode: (mode: "horizontal" | "vertical") => {
        set({ split_mode: mode })
      },
      setDebugMode: (mode: boolean) => {
        set({ in_debug_mode: mode })
      },
    }),
    {
      name: "global-store",
    }
  )
)
