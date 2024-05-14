import "@tscircuit/react-fiber"
import { layout } from "@tscircuit/layout"
import manual_edits from "./manual-edits"

export const MyCircuit = () => (
  <board
    width="40mm"
    height="40mm"
    pcbCenterX={0}
    pcbCenterY={0}
    layout={layout().manualEdits(manual_edits)}
  >
    <resistor
      name="R1"
      resistance="20kohm"
      footprint="0805"
      supplierPartNumbers={{
        jlcpcb: ["C2759650"],
      }}
    />
  </board>
)
