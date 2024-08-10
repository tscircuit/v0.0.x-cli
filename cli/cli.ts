#!/usr/bin/env node

import kleur from "kleur"
import { AppContext } from "./lib/util/app-context"
import { createContextAndRunProgram } from "./lib/util/create-context-and-run-program"

async function main() {
  await createContextAndRunProgram(process.argv)
}

main().catch((e: any) => {
  console.log(kleur.gray(e.stack))
  console.log(kleur.red(`Error running CLI: ${e.toString()}`))
})
