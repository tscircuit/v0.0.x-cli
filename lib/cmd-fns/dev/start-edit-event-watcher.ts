import { DevPackageExample } from "@server/db/get-db"
import { AxiosInstance } from "axios"
import kleur from "kleur"
import { AppContext } from "lib/util/app-context"
import fg from "fast-glob"
import fs from "fs"
import { Project, ts } from "ts-morph"
import * as Path from "path"
import { ManualPcbPosition } from "@tscircuit/builder"
import { deriveSelectorFromPcbComponentId } from "./derive-selector-from-pcb-component-id"

// TODO import from builder when builder exports it
type EditEvent = {
  edit_event_id: string
  pcb_edit_event_type: "edit_component_location"
  pcb_component_id: string
  original_center: { x: number; y: number }
  new_center: { x: number; y: number }
}

export const startEditEventWatcher = async (
  {
    devServerAxios,
  }: {
    devServerAxios: AxiosInstance
  },
  ctx: AppContext
) => {
  let running = true

  ;(async () => {
    let last_edit_event_update_time: Record<string, string> = {}

    while (running) {
      try {
        const dev_package_examples: DevPackageExample[] = await devServerAxios
          .post("/api/dev_package_examples/list", {})
          .then((r) => r.data.dev_package_examples)

        for (const dev_package_example of dev_package_examples) {
          const dev_package_example_id: number =
            dev_package_example.dev_package_example_id as any

          const last_recorded_update_time =
            last_edit_event_update_time[dev_package_example_id]

          if (
            last_recorded_update_time !==
            dev_package_example.edit_events_last_updated_at
          ) {
            console.log(
              kleur.gray(
                `Edit event detected for dev_package_example ${dev_package_example.dev_package_example_id}`
              )
            )
            console.log(
              kleur.gray(`  file_path: ${dev_package_example.file_path}`)
            )

            last_edit_event_update_time[dev_package_example_id] =
              dev_package_example.edit_events_last_updated_at // TODO last_edit_event_updated_at

            console.log(kleur.gray(`  getting new edit events...`))

            const dev_package_example_full = await devServerAxios
              .post("/api/dev_package_examples/get", {
                dev_package_example_id,
              })
              .then((r) => r.data.dev_package_example)

            // 1. Find the *.manual-edits.ts, if there are multiple error
            const manual_edit_files = fg.sync(
              ["**/*.manual-edits.ts", "**/manual-edits.ts"],
              {
                cwd: ctx.cwd,
                ignore: ["node_modules"],
              }
            )

            if (manual_edit_files.length === 0) {
              console.log(
                kleur.red(
                  `No manual edit files found in "${ctx.cwd}", please create a file "manual-edits.ts" or "*.manual-edits.ts" to persist manual edits`
                )
              )
              continue
            }

            if (manual_edit_files.length > 1) {
              console.log(
                kleur.red(
                  `Multiple manual edit files found, tsci currently doesn't know how to handle this, you should go upvote an issue`
                )
              )
              for (let i = 0; i < manual_edit_files.length; i++) {
                console.log(
                  kleur.gray(`  file ${i + 1}: ${manual_edit_files[i]}`)
                )
              }
              continue
            }

            const manual_edit_file = manual_edit_files[0]
            const manual_edit_file_content = fs.readFileSync(
              Path.join(ctx.cwd, manual_edit_file),
              "utf-8"
            )

            console.log(
              kleur.gray(`  found manual edit file: ${manual_edit_file}`)
            )

            // 2. Convert the edit events into ManualPcbPosition[] and append,
            //    removing any old placements/positions for the same selector.
            //    We can completely rewrite the file here for now (we'll need
            //    to preserve comments etc. later)

            const edit_events: EditEvent[] =
              dev_package_example_full.completed_edit_events ?? []

            if (edit_events.length === 0) continue

            const project = new Project()

            const ts_manual_edits_file = project.createSourceFile(
              "manual-edits.ts",
              manual_edit_file_content
            )

            // Access the default export declaration
            const default_export_dec = ts_manual_edits_file
              .getDefaultExportSymbol()!
              .getDeclarations()[0]

            // Get the object literal expression from the export default statement
            const object_literal =
              default_export_dec.getFirstChildByKindOrThrow(
                ts.SyntaxKind.ObjectLiteralExpression
              )

            // Get the `pcb_placements` property
            const pcb_placements_ts =
              object_literal.getPropertyOrThrow("pcb_placements")

            let pcb_placements: (ManualPcbPosition & {
              _edit_event_id?: string
            })[]
            try {
              pcb_placements = JSON.parse(
                pcb_placements_ts.getText().replace(/pcb_placements:\s/, "")
              )
            } catch (e: any) {
              console.log(
                kleur.red(
                  `Error parsing pcb_placements from manual edits file: ${pcb_placements_ts.getText()} ${e.toString()}`
                )
              )
              continue
            }

            const handled_edit_events = new Set<string>(
              pcb_placements
                .map((p) => (p as any)._edit_event_id)
                .filter(Boolean)
            )

            // Add PCB placements from edit events
            for (const edit_event of edit_events) {
              if (handled_edit_events.has(edit_event.edit_event_id)) continue

              // TODO Figure out a good selector for this pcb_component
              const selector = deriveSelectorFromPcbComponentId({
                soup: dev_package_example_full.tscircuit_soup,
                pcb_component_id: edit_event.pcb_component_id,
              })

              const existing_placement_for_selector = pcb_placements.find(
                (pp) => pp.selector === selector
              )

              if (!existing_placement_for_selector) {
                console.log(
                  kleur.gray(
                    `  adding PCB placement from edit event for "${selector}"`
                  )
                )

                pcb_placements.push({
                  _edit_event_id: edit_event.edit_event_id,
                  selector,
                  center: edit_event.new_center,
                  relative_to: "group_center",
                })
              } else {
                existing_placement_for_selector.center = edit_event.new_center
              }

              // Edit the pcb placements object
              pcb_placements_ts.replaceWithText(
                `pcb_placements: ${JSON.stringify(pcb_placements, null, "  ")}`
              )

              // Save the file

              fs.writeFileSync(
                Path.join(ctx.cwd, manual_edit_file),
                ts_manual_edits_file.getFullText()
              )
              await devServerAxios.post("/api/dev_package_examples/update", {
                dev_package_example_id,
                edit_events_last_applied_at:
                  dev_package_example.edit_events_last_updated_at,
              })
            }
          }
        }
      } catch (err: any) {
        console.log(kleur.red(`Error in edit event watcher: ${err.toString()}`))
      }

      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  })()

  return {
    stop: () => {
      running = false
    },
  }
}
