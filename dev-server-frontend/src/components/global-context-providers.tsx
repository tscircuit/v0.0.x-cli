import { Toaster } from "react-hot-toast"
import { QueryClient, QueryClientProvider } from "react-query"

const queryClient = new QueryClient()

export const GlobalContextProviders = ({ children }: any) => (
  <>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    <Toaster />
  </>
)
