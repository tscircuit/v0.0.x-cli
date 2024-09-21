import { AppContext } from "../util/app-context"
import { soupify } from "cli/lib/soupify"
import kleur from "kleur"
import {
  convertCircuitJsonToBomRows,
  convertBomRowsToCsv,
} from "circuit-json-to-bom-csv"

export const exportBomCsvToBuffer = async (
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

  console.log(kleur.gray("[soup to bom rows]..."))
  const bom_rows = await convertCircuitJsonToBomRows({ circuitJson: soup })

  console.log(kleur.gray("[bom rows to csv]..."))
  const bom_csv = await convertBomRowsToCsv(bom_rows)

  return Buffer.from(bom_csv, "utf-8")
}
