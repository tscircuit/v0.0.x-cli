import { NotFoundError, type Middleware } from "edgespec/middleware"
import kleur from "kleur"

export const withErrorResponse: Middleware<{}, {}> = async (req, ctx, next) => {
  try {
    return await next(req, ctx)
  } catch (error: any) {
    // If error is a Response, return it
    if (error instanceof Response) {
      return error
    }
    if (error instanceof NotFoundError) {
      return (ctx as any).json(
        {
          ok: false,
          error: {
            message: error?.message,
            error_code: "not_found",
          },
        },
        { status: error?.status || 404 }
      )
    }

    console.error(kleur.red("Intercepted unhandled error:"), error)
    return (ctx as any).json(
      {
        ok: false,
        error: {
          message: error?.message,
          error_code: error?.error_code ?? "internal_server_error",
        },
      },
      { status: error?.status || 500 }
    )
  }
}
