import "@tscircuit/react-fiber"

export const MyCircuit = () => (
  <board width="40mm" height="40mm" center_x={0} center_y={0}>
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
