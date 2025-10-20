// app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: { default: "Base Wallet Checker", template: "%s • Base Wallet Checker" },
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
  icons: { icon: "/favicon.ico", shortcut: "/favicon.ico", apple: "/apple-touch-icon.png" },
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Pre-apply theme class before paint; default to 'dim' if nothing saved */}
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
      {/* do NOT hard-force dark colors here; let themes control it */}
      <body className="min-h-screen antialiased">
        <ThemeProvider>{children}
           <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
