import { layout } from "@tscircuit/layout"
import manual_edits from "../src/manual-edits"

export const BasicBug = () => (
  <group layout={layout().manualPcbPlacement(manual_edits.pcb_placements)}>
    <bug
      name="U2"
      port_arrangement={{
        left_size: 4,
        right_size: 4,
      }}
      footprint="sparkfun:ssop16"
      center={[-10, 0]}
      port_labels={{
        "1": "GND",
        "2": "VBUS",
        "3": "D-",
        "4": "D+",
      }}
    />
  </group>
)
