import { ParamHandler } from "./param-handler-type"
import * as fs from "fs/promises"

// Use prompts to allow searching for a file
// 1. Show a prompt with two options
//    - "Manually Enter Path"
//    - "Browse for File"
// 2. If Browse for File is selected, show all the files in the current
//    directory with the "autocomplete" prompts type, then allow the user
//    to select a file or directory
export const interactForLocalFile: ParamHandler = async ({ prompts }) => {
  const { selectionMode } = await prompts({
    type: "select",
    name: "selectionMode",
    message: "Select a file",
    choices: [
      { title: "Manually Enter Path", value: "manual" },
      { title: "Browse for File", value: "browse" },
    ],
  })

  if (selectionMode === "manual") {
    const { manualPath } = await prompts({
      type: "text",
      name: "manualPath",
      message: "Enter the path to the file",
    })
    return manualPath
  }

  let currentDirectory = "."
  while (true) {
    const files = await fs.readdir(currentDirectory)
    const { selectedFile } = await prompts({
      type: "autocomplete",
      name: "selectedFile",
      message: "Select a file or directory",
      choices: [
        { title: ".. (Go Up)", value: ".." },
        ...files.map((file) => ({ title: file, value: file })),
      ],
    })
    if (selectedFile === "..") {
      // Go up one directory
      const lastIndex = currentDirectory.lastIndexOf("/")
      currentDirectory = currentDirectory.substring(0, lastIndex)
    } else {
      // Check if selectedFile is a file or directory
      const stats = await fs.stat(`${currentDirectory}/${selectedFile}`)
      if (stats.isFile()) {
        // Break out of the loop and return the selected file
        return `${currentDirectory}/${selectedFile}`
      } else {
        // Go into the selected directory
        currentDirectory = `${currentDirectory}/${selectedFile}`
      }
    }
  }
}
