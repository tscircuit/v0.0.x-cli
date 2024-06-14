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
      pcbX={0}
      pcbY={0}
      footprint="0805"
      supplierPartNumbers={{
        jlcpcb: ["C2759650"],
      }}
    />
    <resistor
      name="R2"
      pcbX={5}
      pcbY={0}
      resistance="20kohm"
      footprint="0805"
      supplierPartNumbers={{
        jlcpcb: ["C2759650"],
      }}
    />
    <trace from=".R1 > .right" to=".R2 > .left" />
    {/* <tracehint
      for=".R1 > .right"
      offsets={[
        {
          x: 3,
          y: 3,
        },
      ]}
    /> */}
  </board>
)
