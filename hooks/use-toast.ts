// hooks/use-toast.ts
import * as React from "react";

// Minimal local types (so we don't import "@/components/ui/toast")
export type ToastActionElement = React.ReactNode;
export type ToastProps = {
  title?: string;
  description?: string;
  action?: ToastActionElement;
};

// Simple global counter for ids
let lastId = 0;

// Standalone toast emitter (alert in browser, console on server)
function emitToast(props: ToastProps) {
  const msg = [props.title, props.description].filter(Boolean).join("\n");
  if (typeof window !== "undefined") {
    if (msg) alert(msg);
  } else {
    console.log("toast:", props);
  }
  return { id: String(++lastId) };
}

export function useToast() {
  const toast = React.useCallback((props: ToastProps) => emitToast(props), []);
  const dismiss = React.useCallback((_id?: string) => {}, []);
  return { toast, dismiss, toasts: [] as Array<{ id: string }> };
}

// Optional direct helper (mirrors shadcn API)
export const toast = (props: ToastProps) => emitToast(props);
