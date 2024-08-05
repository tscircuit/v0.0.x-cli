import kleur from "kleur"
import type { AppContext } from "lib/util/app-context"
import open from "open"

export const goCmd = async (ctx: AppContext, args: any) => {
  const tutorialUrl = "https://docs.tscircuit.com/quickstart"

  console.log(
    kleur.cyan(
      "Opening the TSCircuit Getting Started tutorial in your browser..."
    )
  )
  await open(tutorialUrl)
}
