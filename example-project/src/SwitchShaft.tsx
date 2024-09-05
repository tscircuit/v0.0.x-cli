import "@tscircuit/core"

/**
 * A switch shaft you can use to connect a pluggable Kailh socket.
 *
 * Datasheet: https://wmsc.lcsc.com/wmsc/upload/file/pdf/v2/lcsc/2211090930_Kailh-CPG151101S11-1_C5184526.pdf
 */
export const SwitchShaft = (props: {
  name: string
  pcbX?: number
  pcbY?: number
}) => (
  <chip
    {...props}
    footprint={
      <footprint>
        <smtpad
          pcbX={0}
          pcbY={0}
          shape="rect"
          width="2.55mm"
          height="2.5mm"
          portHints={["pin1"]}
        />
        <hole pcbX={0} pcbY={0} holeDiameter="3mm" />
      </footprint>
    }
  />
)
