import type { AnySoupElement } from "@tscircuit/builder"
export const deriveSelectorFromPcbComponentId = ({
  soup,
  pcb_component_id,
}: {
  soup: AnySoupElement[]
  pcb_component_id: string
}) => {
  const pcb_component = soup.find(
    (e) => e.type === "pcb_component" && e.pcb_component_id === pcb_component_id
  )
  if (!pcb_component)
    throw new Error(
      `Could not find pcb_component with id "${pcb_component_id}"`
    )
  const source_component = soup.find(
    (e) =>
      e.type === "source_component" &&
      e.source_component_id === pcb_component.source_component_id
  )
}
