// app/layout.tsx
import "./globals.css";

import type { Metadata, Viewport } from "next";
import Script from "next/script";
import ThemeProvider from "@/providers/ThemeProvider";
import Providers from "./providers";
import { Analytics } from "@vercel/analytics/react";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

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
  // You can keep icons here, but we’ll also add explicit <link> tags below to beat caching.
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* OnchainKit CSS via static file */}
        <link rel="stylesheet" href="/onchainkit.css" />

        {/* 🔑 Favicons with cache-busting to force refresh in dev */}
        <link rel="icon" href="/favicon.ico?v=3" sizes="any" />
        <link rel="icon" type="image/png" href="/icon.png?v=3" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=3" />

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
