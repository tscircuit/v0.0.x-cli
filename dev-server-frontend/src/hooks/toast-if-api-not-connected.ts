import { useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast"

export const useToastIfApiNotConnected = () => {
  useEffect(() => {
    let lastWasConnected = true
    const interval = setInterval(async () => {
      try {
        await axios.get("/api/health")
        if (!lastWasConnected) {
          toast.success("Reconnected to dev server API")
          lastWasConnected = true
        }
      } catch (e) {
        toast.error("Not connected to dev server API")
        lastWasConnected = false
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])
}
