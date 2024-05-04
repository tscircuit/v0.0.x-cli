import "@tscircuit/react-fiber"
import { layout } from "@tscircuit/layout"
import manual_edits from "./manual-edits"

export const MyCircuit = () => (
  <board
    width="40mm"
    height="40mm"
    center_x={0}
    center_y={0}
    layout={layout().manualPcbPlacement(manual_edits.pcb_placements)}
  >
    <resistor
      name="R1"
      resistance="20kohm"
      footprint="0805"
      supplier_part_numbers={{
        jlcpcb: "C2759650",
      }}
    />
  </board>
)
