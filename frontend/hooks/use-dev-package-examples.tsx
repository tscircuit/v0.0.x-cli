"use client"
import { useQuery } from "react-query"
import axios from "axios"
import { inflatePackageExample } from "../components/select-example-search"

export const useDevPackageExamples = () => {
  return useQuery("examples", async () => {
    const { data } = await axios.get("/api/dev_package_examples/list")
    return data.dev_package_examples.map(inflatePackageExample) as Array<{
      dev_package_example_id: number
      searchable_id: string
      file_path: string
      expath: string
      export_name: string
      last_updated_at: string
    }>
  })
}
