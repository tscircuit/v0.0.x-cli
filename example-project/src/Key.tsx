import { Keyswitch } from "./Keyswitch"
import { KeyswitchSocket } from "./KeyswitchSocket"

export const Key = (props: {
  name: string
  keyNum: number
  pcbX: number
  pcbY: number
}) => {
  const socketName = `SW${props.keyNum}`
  const switchHoleName = `HO${props.keyNum}`
  const diodeName = `D${props.keyNum}`
  return (
    <>
      <KeyswitchSocket
        key="shaft1"
        layer="bottom"
        name={socketName}
        pcbX={props.pcbX}
        pcbY={props.pcbY}
      />
      <Keyswitch
        key="switch"
        name={switchHoleName}
        pcbX={props.pcbX + 0.55}
        pcbY={props.pcbY + -3.81}
      />
      <diode
        // @ts-ignore
        key="diode"
        pcbRotation={-90}
        name={diodeName}
        footprint="0603"
        layer="bottom"
        pcbX={props.pcbX + 7}
        pcbY={props.pcbY - 6}
      />
      <trace
        // @ts-ignore
        key="trace1"
        from={`.${socketName} .pin2`}
        to={`.${diodeName} .pin1`}
      />
    </>
  )
}
