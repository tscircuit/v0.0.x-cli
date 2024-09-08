# Edit Event Pipeline

Whenever someone makes a manual edit to tscircuit, a `manual-edits.ts` file is created
or edited describing what was changed. This file can be loaded into a `<board />` component
with `layout={layout().manualEdits(manualEdits)}`.

There pipeline for edit events is kind of complicated because the event must appear
to happen instantaneously, but must also be stored, and the circuit should be
re-rendered to determine the new routing.

If you're debugging the edit event pipeline, turn on the debug logs:

```bash
DEBUG=tscircuit:cli:edit-event-watcher
```

## How the Edit Events are Processed

This these are all the steps that happen to add an edit to `manual-edits.ts`,
then apply it to the circuit.

1. The user makes a change inside the `pcb-viewer` or `schematic-viewer`
2. An edit event is emitted via e.g. `<PCBViewer onEditEventsChanged={...} />`
3. The edit event is added to the list of `instantEditEvents` in `MainContentView.tsx`
   1. Instant edit events are applied on the browser side, but don't re-route the circuit
   2. You can tell you're in the phase where the edit event is still be processed and hasn't
      been rendered because the traces still point to the old location
4. The edit event is sent to the api server in a post request to `/api/dev_package_examples/update`
5. The api server adds the edit event to the database
6. The CLI "watcher" (see `start-edit-event-watcher.ts`) polls for new edit events
7. The CLI watcher edits the `manual-edits.ts` file and triggers the circuit to re-render
8. The circuit re-renders and the circuit json (soup) is updated on the server via `/api/dev_package_examples/update`
9. The browser polls for the updated soup via `/api/dev_package_examples/get_soup` and the browser
   updates with the fully routed circuit json
