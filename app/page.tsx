// app/page.tsx
"use client";
import BaseWalletChecker from "@/components/BaseWalletChecker";
import ThemeToggle from "@/components/ThemeToggle";

export default function Page() {
  return (
    <main className="max-w-5xl mx-auto p-6">
      <header className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Base Wallet Checker</h1>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>
      <BaseWalletChecker />
    </main>
  );
}
