import "@tscircuit/core"
import { layout } from "@tscircuit/layout"
import manual_edits from "../src/manual-edits"

export const BasicChip = () => (
  <board pcbX={0} pcbY={0} width="20mm" height="20mm">
    <group subcircuit>
      <chip
        name="U2"
        schPortArrangement={{
          leftSize: 8,
          rightSize: 8,
        }}
        footprint="ssop16"
        pinLabels={{
          "1": "GND",
          "2": "VBUS",
          "3": "D-",
          "4": "D+",
        }}
      />
      <resistor name="R1" pcbX={4} resistance="10kohm" footprint="0805" />
      <trace from=".U2 > .1" to=".R1 > port.1" />
    </group>
  </board>
)
