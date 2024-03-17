import { AxiosInstance } from "axios"
import chokidar from "chokidar"
import { uploadExamplesFromDirectory } from "./upload-examples-from-directory"
import kleur from "kleur"

export const startWatcher = async ({
  cwd,
  devServerAxios,
}: {
  cwd: string
  devServerAxios: AxiosInstance
}) => {
  const watcher = chokidar.watch(`${cwd}/**/*.tsx`, {
    ignored: /node_modules/,
    persistent: true,
  })

  const upload_queue_state = {
    dirty: false,
    should_run: true,
  }
  watcher.on("change", async (path) => {
    console.log(`File ${path} has been changed`)
    // TODO analyze to determine which examples were impacted
    upload_queue_state.dirty = true
  })

  async function uploadInBackground() {
    while (upload_queue_state.should_run) {
      if (upload_queue_state.dirty) {
        console.log(kleur.yellow("Changes detected, re-uploading examples..."))
        upload_queue_state.dirty = false
        await uploadExamplesFromDirectory({ cwd, devServerAxios })
      }
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  const _backgroundUploaderPromise = uploadInBackground()

  return {
    _backgroundUploaderPromise,
    stop: () => {
      upload_queue_state.should_run = false
      watcher.close()
    },
  }
}
