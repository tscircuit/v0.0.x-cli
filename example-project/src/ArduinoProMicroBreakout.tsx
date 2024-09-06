export const ArduinoProMicroBreakout = (props: {
  name: string
  pcbX?: number
  pcbY?: number
}) => (
  <chip
    {...props}
    footprint="dip24_w0.7in_h1.3in"
    pinLabels={{
      pin1: "TXD",
      pin2: "RXI",
      pin3: "GND1",
      pin4: "GND2",
      pin5: "D2",
      pin6: "D3",
      pin7: "D4",
      pin8: "D5",
      pin9: "D6",
      pin10: "D7",
      pin11: "D8",
      pin12: "D9",
      // right side (from bottom)
      pin13: "D10",
      pin14: "D16",
      pin15: "D14",
      pin16: "D15",
      pin17: "A0",
      pin18: "A1",
      pin19: "A2",
      pin20: "A3",
      pin21: "VCC",
      pin22: "RST",
      pin23: "GND3",
      pin24: "RAW",
    }}
  />
)
