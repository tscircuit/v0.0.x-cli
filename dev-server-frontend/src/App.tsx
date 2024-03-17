import { TabsContent } from "./components/ui/tabs"
import { MenubarShortcut } from "src/components/ui/menubar"
import { CommandK } from "./components/command-k"
import { useToastIfApiNotConnected } from "./hooks/toast-if-api-not-connected"
import { Header } from "./Header"
import { ExampleContentView } from "./ExampleContentView"

function App() {
  useToastIfApiNotConnected()

  return (
    <div className="">
      <Header />
      <div className="">
        <ExampleContentView />
      </div>
      <CommandK />
    </div>
  )
}

export default App
