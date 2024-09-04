import "@tscircuit/core"

export const SwitchShaft = (props: {
  name: string
  pcbX?: number
  pcbY?: number
}) => (
  <chip
    {...props}
    footprint={
      <footprint>
        <smtpad pcbX={0} pcbY={0} shape="rect" width="2.55mm" height="2.5mm" />
      </footprint>
    }
  />
)
