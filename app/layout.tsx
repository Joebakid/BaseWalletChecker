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

 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/onchainkit.css" />
        <link rel="icon" href="/favicon.ico?v=3" sizes="any" />
        <link rel="icon" type="image/png" href="/icon.png?v=3" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=3" />

        {/* Apply saved theme ASAP to avoid flash */}
        <Script id="apply-theme" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var STORAGE_KEY = 'theme';
                var all = ['light', 'dim', 'dark'];
                var t = localStorage.getItem(STORAGE_KEY) || 'dim';
                var el = document.documentElement;
                el.classList.remove('light','dim','dark');
                if (all.indexOf(t) === -1) t = 'dim';
                el.classList.add(t);
              } catch (e) {}
            })();
          `}
        </Script>
      </head>
      <body className="min-h-screen antialiased transition-colors duration-300 bg-white text-black dark:bg-black dark:text-white">
        <ThemeProvider>
          <Providers>{children}</Providers>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
