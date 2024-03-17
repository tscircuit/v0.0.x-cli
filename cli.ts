#!/usr/bin/env node

import { AppContext } from "./lib/util/app-context"
import { createContextAndRunProgram } from "./lib/util/create-context-and-run-program"

async function main() {
  await createContextAndRunProgram(process.argv)
}

main().catch((e) => {
  console.log("Error running CLI:", e.toString())
})
