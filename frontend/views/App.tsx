import { TabsContent } from "frontend/components/ui/tabs"
import { MenubarShortcut } from "frontend/components/ui/menubar"
import { CommandK } from "frontend/components/command-k"
import { useToastIfApiNotConnected } from "frontend/hooks/toast-if-api-not-connected"
import { Header } from "./Header"
import { MainContentView } from "./MainContentView"

function App() {
  useToastIfApiNotConnected()

  return (
    <div className="">
      <Header />
      <div className="">
        <MainContentView />
      </div>
      <CommandK />
    </div>
  )
}

export default App
