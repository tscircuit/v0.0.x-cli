import { z } from "zod"

export const export_package_info = z.object({
  name: z.string()
})