import { AppContext } from "../util/app-context"
import { soupify } from "cli/lib/soupify"
import {
  convertCircuitJsonToKiCadPcb,
  convertKiCadPcbToSExprString,
} from "kicad-converter"
import kleur from "kleur"

export const exportKicadPcbToBuffer = async (
  params: {
    example_file_path: string
    export_name?: string
  },
  ctx: AppContext,
) => {
  console.log(kleur.gray("[soupifying]..."))
  const soup = await soupify(
    {
      filePath: params.example_file_path,
      exportName: params.export_name,
    },
    ctx,
  )

  console.log(kleur.gray("[converting to KiCad PCB]..."))
  const kicadPcb = convertCircuitJsonToKiCadPcb(soup)

  console.log(kleur.gray("[converting to S-expression string]..."))
  const kicadPcbString = convertKiCadPcbToSExprString(kicadPcb)

  return Buffer.from(kicadPcbString, "utf-8")
}
