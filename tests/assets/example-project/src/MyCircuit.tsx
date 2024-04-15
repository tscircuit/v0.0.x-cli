import "@tscircuit/react-fiber"

export const MyCircuit = () => (
  <board width="40mm" height="40mm" center_x={0} center_y={0}>
    <resistor
      name="R1"
      resistance="20kohm"
      footprint="1210"
      supplier_part_numbers={{
        jlcpcb: "C2759650",
      }}
    />
  </board>
)
