// app/page.tsx
"use client";

import { useEffect } from "react";
import BaseWalletChecker from "@/components/BaseWalletChecker";
// import BaseDappTxs from "@/components/BaseDappTxs";
// import ThemeToggle from "@/components/ThemeToggle"; // remove if you don’t have it

// One of these imports will match your @coinbase/onchainkit version
import { minikit } from "@coinbase/onchainkit";
// import { MiniKit as minikit } from "@coinbase/onchainkit";

export default function Page() {
  useEffect(() => {
    try {
      minikit.ready();
    } catch (err) {
      // safe to ignore if running outside Base container
      console.warn("MiniApp ready() call failed (outside container):", err);
    }
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto p-6">
        <header className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">Base Wallet Checker</h1>
          {/* <div className="ml-auto">
            <ThemeToggle />
          </div> */}
        </header>

        {/* Wallet overview / balances / raw txs (your existing component) */}
        <section className="mb-10">
          <BaseWalletChecker />
        </section>
      </div>
    </main>
  );
}
