// app/page.tsx
"use client";

import { useEffect } from "react";
import BaseWalletChecker from "@/components/BaseWalletChecker";
// import ThemeToggle from "@/components/ThemeToggle"; // keep commented if not present

export default function Page() {
  useEffect(() => {
    // Works in Base mini-app container; no-op elsewhere
    try {
      (window as any)?.farcaster?.miniapp?.ready?.();
    } catch {}
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto p-6">
        <header className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">Base Wallet Checker</h1>
          {/* <div className="ml-auto"><ThemeToggle /></div> */}
        </header>

        <section className="mb-10">
          <BaseWalletChecker />
        </section>
      </div>
    </main>
  );
}
