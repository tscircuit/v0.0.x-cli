import {
  convertSoupToPickAndPlaceCsv
} from "@tscircuit/builder"
import kleur from "kleur"
import { soupify } from "lib/soupify"
import { AppContext } from "../util/app-context"

export const exportPnpCsvToBuffer = async (
  params: {
    example_file_path: string
    export_name?: string
    no_cleanup: boolean
  },
  ctx: AppContext
) => {
  console.log(kleur.gray("[soupifying]..."))
  const soup = await soupify(
    {
      filePath: params.example_file_path,
      exportName: params.export_name,
      no_cleanup: params.no_cleanup,
    },
    ctx
  )

  console.log(kleur.gray("[soup to pnp csv string]..."))
  const pnp_csv = await convertSoupToPickAndPlaceCsv(soup)

  return Buffer.from(pnp_csv, "utf-8")
}
