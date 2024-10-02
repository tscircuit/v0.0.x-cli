import "@tscircuit/react-fiber"
import { layout } from "@tscircuit/layout"
import manual_edits from "./manual-edits"

export const MyCircuit = () => (
  <board width="40mm" height="40mm" pcbX={0} pcbY={0}>
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
    <trace from=".R1 > .pin1" to=".R2 > .pin2" />
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
