#!/usr/bin/env node

import kleur from "kleur"
import { createContextAndRunProgram } from "./lib/util/create-context-and-run-program"

async function main() {
  await createContextAndRunProgram(process.argv)
}

main().catch((e: Error) => {
  console.log(kleur.gray(e.stack ?? ""))
  console.log(kleur.red(`Error running CLI: ${e.toString()}`))
})
