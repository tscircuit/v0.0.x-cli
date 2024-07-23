import { PostHog } from "posthog-node"

const POSTHOG_API_KEY: string | undefined = process.env.POSTHOG_API_KEY

let posthogInstance: PostHog | null = null

if (POSTHOG_API_KEY) {
  posthogInstance = new PostHog(POSTHOG_API_KEY, {
    host: "https://us.i.posthog.com",
  })
}

const posthogProxy = new Proxy<PostHog>({} as PostHog, {
  get(target, prop) {
    if (posthogInstance) {
      return Reflect.get(posthogInstance, prop)
    }
    // Return a no-op function for any method call if PostHog is not initialized
    return () => {}
  },
})

export default posthogProxy
