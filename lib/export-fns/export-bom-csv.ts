import { AppContext } from "../util/app-context"
import { soupify } from "lib/soupify"
import { convertSoupToBomRows, convertBomRowsToCsv } from "@tscircuit/builder"
import kleur from "kleur"

export const exportBomCsvToBuffer = async (
  params: {
    example_file_path: string
    export_name?: string
  },
  ctx: AppContext
) => {
  console.log(kleur.gray("[soupifying]..."))
  const soup = await soupify(
    {
      filePath: params.example_file_path,
      exportName: params.export_name,
    },
    ctx
  )

  console.log(kleur.gray("[soup to bom rows]..."))
  // @ts-ignore
  const bom_rows = await convertSoupToBomRows({ soup })

  console.log(kleur.gray("[bom rows to csv]..."))
  const bom_csv = await convertBomRowsToCsv(bom_rows)

  return Buffer.from(bom_csv, "utf-8")
}
