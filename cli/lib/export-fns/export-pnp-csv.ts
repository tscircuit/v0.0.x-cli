import { AppContext } from "../util/app-context"
import { z } from "zod"
import * as Path from "path"
import { unlink } from "node:fs/promises"
import { soupify } from "cli/lib/soupify"
import * as fs from "fs"
import kleur from "kleur"
import archiver from "archiver"

export const exportPnpCsvToBuffer = async (
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

  console.log(kleur.gray("[soup to pnp csv string]..."))
  throw new Error(
    "This functionality was previously available in @tscircuit/builder but has been removed. Please extract from builder and re-implement. If you're an end-user, sorry.",
  )
  // const pnp_csv = await convertSoupToPickAndPlaceCsv(soup)

  // return Buffer.from(pnp_csv, "utf-8")
}
