import { layout } from "@tscircuit/layout"
import manualEdits from "example-project/src/manual-edits"
import { SwitchShaft } from "example-project/src/SwitchShaft"

export const MacroKeypad = () => (
  <board width="20mm" height="20mm">
    <SwitchShaft name="SW1" pcbX={3} pcbY={3} />
    {/* <SwitchShaft name="SW2" /> */}
  </board>
)
