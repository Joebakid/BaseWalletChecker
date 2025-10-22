// app/layout.tsx
import "./globals.css"; // Tailwind only — no OnchainKit import here

import type { Metadata } from "next";
import Script from "next/script";
import ThemeProvider from "@/providers/ThemeProvider";
import Providers from "./providers";
import { Analytics } from "@vercel/analytics/react";

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
    images: ["/og.png"],  // ✅ 1200×630
  },
  twitter: {
    card: "summary_large_image",
    title: "Base Wallet Checker",
    description:
      "Analyze Base wallet activity with clean stats pulled from Blockscout.",
    images: ["/og.png"],  // ✅ reused for Twitter
  },
  icons: {
    icon: "/favicon.ico",              // browser tab
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",   // iOS
  },
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

 


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Load OnchainKit CSS as a static stylesheet (bypasses PostCSS/Tailwind) */}
        <link rel="stylesheet" href="/onchainkit.css" />

        {/* Pre-apply theme before paint */}
        <Script id="apply-theme" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var t = localStorage.getItem('theme') || 'dim';
                var el = document.documentElement;
                el.classList.remove('light','dim','dark');
                el.classList.add(t);
              } catch (e) {}
            })();
          `}
        </Script>
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <Providers>{children}</Providers>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
