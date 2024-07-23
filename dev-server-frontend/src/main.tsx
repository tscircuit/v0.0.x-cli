import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import { GlobalContextProviders } from "./components/global-context-providers.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalContextProviders>
      <App />
    </GlobalContextProviders>
  </React.StrictMode>,
)
