import { AppContext } from "lib/util/app-context"
import prompts from "prompts"

export type ParamHandler = (params: {
  prompts: typeof prompts
  ctx: AppContext
}) => Promise<string | null | void>
