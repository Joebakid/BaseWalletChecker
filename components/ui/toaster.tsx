"use client"

import * as React from "react"
import { Toast } from "./toast"

export function Toaster() {
  const [toasts, setToasts] = React.useState<
    { id: number; message: string; variant?: "default" | "success" | "error" }[]
  >([])

  // expose global helper
  React.useEffect(() => {
    ;(window as any).toast = (message: string, variant?: "default" | "success" | "error") => {
      setToasts((t) => [...t, { id: Date.now(), message, variant }])
    }
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <Toast key={t.id} variant={t.variant}>
          {t.message}
        </Toast>
      ))}
    </div>
  )
}
