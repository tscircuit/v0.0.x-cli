import type { AnySoupElement } from "@tscircuit/builder"
import su from "@tscircuit/soup-util"

export const deriveSelectorFromPcbComponentId = ({
  soup,
  pcb_component_id,
}: {
  soup: AnySoupElement[]
  pcb_component_id: string
}) => {
  const source_component = su(soup).source_component.getUsing({
    pcb_component_id,
  })
  if (!source_component) {
    throw new Error(
      `Could not find source component for pcb_component_id="${pcb_component_id}"`
    )
  }

  // TODO travel up the tree to make the selector more specific

  return `.${source_component.name}`
}
