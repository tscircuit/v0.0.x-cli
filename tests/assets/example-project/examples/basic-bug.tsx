import { layout } from "@tscircuit/layout"
import manual_edits from "../src/manual-edits"

export const BasicBug = () => (
  <board pcbCenterX={0} pcbCenterY={0} width="20mm" height="20mm">
    <group
      layout={layout()
        .autoLayoutSchematic()
        .manualPcbPlacement(manual_edits.pcb_placements)}
    >
      <bug
        name="U2"
        schPortArrangement={{
          leftSize: 4,
          rightSize: 4,
        }}
        footprint="ssop16"
        pinLabels={{
          "1": "GND",
          "2": "VBUS",
          "3": "D-",
          "4": "D+",
        }}
      />
      <resistor name="R1" resistance="10kohm" footprint="0805" />
      <trace from=".U2 > .1" to=".R1 > .left" />
    </group>
  </board>
)
