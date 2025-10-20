// app/page.tsx
"use client";

import BaseWalletChecker from "@/components/BaseWalletChecker";
// import BaseDappTxs from "@/components/BaseDappTxs";
import ThemeToggle from "@/components/ThemeToggle"; // ← remove this line + <ThemeToggle /> below if you don't have the component

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto p-6">
        <header className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">Base Wallet Checker</h1>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        {/* Wallet overview / balances / raw txs (your existing component) */}
        <section className="mb-10">
          <BaseWalletChecker />
        </section>

       
      </div>
    </main>
  );
}
