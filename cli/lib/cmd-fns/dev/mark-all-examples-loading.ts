import { AxiosInstance } from "axios"

export const markAllExamplesLoading = async ({
  devServerAxios,
}: {
  devServerAxios: AxiosInstance
}) => {
  const examples = await devServerAxios
    .post("/api/dev_package_examples/list")
    .then((r) => r.data.dev_package_examples)

  for (const example of examples) {
    await devServerAxios.post("/api/dev_package_examples/update", {
      dev_package_example_id: example.dev_package_example_id,
      is_loading: true,
    })
  }
}
