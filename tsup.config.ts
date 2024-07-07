import { defineConfig } from 'tsup'

export default defineConfig({
  define: {
    POSTHOG_API_KEY: JSON.stringify(process.env.POSTHOG_API_KEY || ''),
  },
})