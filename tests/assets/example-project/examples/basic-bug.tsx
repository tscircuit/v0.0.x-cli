export const BasicBug = () => (
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
)
