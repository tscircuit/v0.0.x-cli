import { AppContext } from "../util/app-context"
import { soupify } from "cli/lib/soupify"
import kleur from "kleur"

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
  // @ts-ignore
  const bom_rows = await convertSoupToBomRows({ soup })

  console.log(kleur.gray("[bom rows to csv]..."))
  throw new Error(
    "This functionality was previously available in @tscircuit/builder but has been removed. Please extract from builder and re-implement. If you're an end-user, sorry.",
  )
  // const bom_csv = await convertBomRowsToCsv(bom_rows)

  // return Buffer.from(bom_csv, "utf-8")
}
