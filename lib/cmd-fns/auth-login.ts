import { AppContext } from "../util/app-context"
import delay from "delay"

export const authLogin = async (ctx: AppContext, args: any) => {
  const {
    data: { login_page },
  } = await ctx.axios.post("/sessions/login_page/create", {})

  console.log("Please visit the following URL to log in:")
  console.log(login_page.url)

  // Wait until we receive confirmation
  while (true) {
    const {
      data: { login_page: new_login_page },
    } = await ctx.axios.post(
      "/sessions/login_page/get",
      {
        login_page_id: login_page.login_page_id,
      },
      {
        headers: {
          Authorization: `Bearer ${login_page.login_page_auth_token}`,
        },
      },
    )

    if (new_login_page.was_login_successful) {
      console.log("Logged in! Generating token...")
      break
    }

    if (new_login_page.is_expired) {
      throw new Error("Login page expired")
    }

    await delay(1000)
  }

  const {
    data: { session },
  } = await ctx.axios.post(
    "/sessions/login_page/exchange_for_cli_session",
    {
      login_page_id: login_page.login_page_id,
    },
    {
      headers: {
        Authorization: `Bearer ${login_page.login_page_auth_token}`,
      },
    },
  )

  ctx.profile_config.set("session_token", session.token)

  // TODO test query

  console.log("Ready to use!")
}
