// app/layout.tsx
import "./globals.css";
import type { Viewport } from "next";
import Script from "next/script";
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

        {/* Initial theme setup */}
        <Script id="apply-theme" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var STORAGE_KEY = 'theme';
                var el = document.documentElement;
                var saved = localStorage.getItem(STORAGE_KEY);

                var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                var theme = saved;

                if (!theme) {
                  theme = systemDark ? 'dark' : 'light';
                }

                if (!['light','dark'].includes(theme)) {
                  theme = 'dark';
                }

                el.classList.remove('light','dark');
                el.classList.add(theme);
              } catch (e) {}
            })();
          `}
        </Script>
      </head>

      <body className="min-h-screen antialiased transition-colors duration-300">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}