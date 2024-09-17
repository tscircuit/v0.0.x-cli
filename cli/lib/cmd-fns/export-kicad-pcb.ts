import { AppContext } from "../util/app-context"
import { z } from "zod"
import { soupify } from "cli/lib/soupify"
import {
  convertCircuitJsonToKiCadPcb,
  convertKiCadPcbToSExprString,
} from "kicad-converter"
import fs from "fs/promises"
import kleur from "kleur"

export const exportKicadPcb = async (ctx: AppContext, args: any) => {
  const params = z
    .object({
      input: z.string(),
      export: z.string().optional(),
      outputfile: z.string().default("output.kicad_pcb"),
    })
    .parse(args)

  console.log(kleur.gray("[soupifying]..."))
  const soup = await soupify(
    {
      filePath: params.input,
      exportName: params.export,
    },
    ctx,
  )

  console.log(kleur.gray("[converting to KiCad PCB]..."))
  const kicadPcb = convertCircuitJsonToKiCadPcb(soup)

  console.log(kleur.gray(`[writing to ${params.outputfile}]...`))
  await fs.writeFile(params.outputfile, convertKiCadPcbToSExprString(kicadPcb))

  console.log(kleur.green(`KiCad PCB file exported to ${params.outputfile}`))
}
