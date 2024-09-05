import { layout } from "@tscircuit/layout"
import manualEdits from "example-project/src/manual-edits"
import { SwitchShaft } from "example-project/src/SwitchShaft"

export const MacroKeypad = () => (
  <board
    pcbX={0}
    pcbY={0}
    width="20mm"
    height="20mm"
    layout={layout().manualEdits(manualEdits)}
  >
    <SwitchShaft name="SW1" />
  </board>
)
