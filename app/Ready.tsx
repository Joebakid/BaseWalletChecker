// app/Ready.tsx
"use client";
import { useEffect } from "react";

export default function Ready() {
  useEffect(() => {
    try {
      // This is the official Farcaster MiniApp handshake
      (window as any)?.farcaster?.miniapp?.ready?.();
      console.log("Miniapp ready() called");
    } catch (err) {
      console.warn("Miniapp ready() failed:", err);
    }
  }, []);
  return null;
}
