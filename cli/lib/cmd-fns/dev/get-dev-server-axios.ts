import kleur from "kleur"
import defaultAxios from "axios"

export const getDevServerAxios = ({ serverUrl }: { serverUrl: string }) => {
  const devServerAxios = defaultAxios.create({
    baseURL: serverUrl,
  })

  // https://github.com/oven-sh/bun/issues/267
  devServerAxios.defaults.headers.common["Accept-Encoding"] = "gzip"

  devServerAxios.interceptors.response.use(
    (res) => res,
    (err) => {
      console.log(
        kleur.red(
          `[ERR] ${err.response?.status} ${err.config.method?.toUpperCase()} ${
            err.config.url
          }\n\n${JSON.stringify(err.response?.data, null, "  ")}`
            .replace(/\\n/g, "\n")
            .replace(/\\"/g, '"'),
        ),
      )
      console.log(kleur.yellow("[Request Body]:"), err.config.data)
      return Promise.reject(err)
    },
  )
  return devServerAxios
}
