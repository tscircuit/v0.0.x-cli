/**
 * Keyswitch (Brown)
 *
 * https://www.lcsc.com/datasheet/lcsc_datasheet_1912111437_Kailh-CPG1511F01S03_C400227.pdf
 */
export const Keyswitch = (props: {
  name: string
  pcbX?: number
  pcbY?: number
}) => {
  return (
    <chip
      {...props}
      cadModel={{
        objUrl:
          "https://modelcdn.tscircuit.com/easyeda_models/download?pn=C400227",
        rotationOffset: { x: 180, y: 0, z: -90 },
      }}
      footprint={
        <footprint>
          <hole diameter={2.5} pcbX={0} pcbY={0} />
        </footprint>
      }
    />
  )
}
