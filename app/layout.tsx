// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "Base Wallet Checker",
    template: "%s • Base Wallet Checker",
  },
  description:
    "Frontend-only Base wallet checker using Blockscout (no accounts). Analyze Base addresses for native, ERC-20 and NFT transfers, fees, peers, and more.",
  metadataBase: new URL("https://base-walletchecker.vercel.app/"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Base Wallet Checker",
    description:
      "Analyze any Base address: native/ ERC-20/ NFT transfers, fees, peers, days active, and more.",
    url: "/",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base Wallet Checker",
    description: "Analyze Base wallet activity with clean stats pulled from Blockscout.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Don't force dark here—let .dark/.dim/.light control it */}
      <body className="min-h-screen antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
