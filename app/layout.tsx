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
  // If you know your domain, uncomment the next line and set it:
  metadataBase: new URL("https://base-walletchecker.vercel.app/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "Base Wallet Checker",
    description:
      "Analyze any Base address: native/ ERC-20/ NFT transfers, fees, peers, days active, and more.",
    url: "/",
    images: ["/og.png"], // add a 1200x630 image to /public/og.png
  },
  twitter: {
    card: "summary_large_image",
    title: "Base Wallet Checker",
    description:
      "Analyze Base wallet activity with clean stats pulled from Blockscout.",
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
      {/* If you hard-force dark here, light/dim themes won't show.
          Keep your current classes if you prefer always-dark. */}
      <body className="min-h-screen bg-black text-gray-100">
        {/* ThemeProvider must be a Client Component; your provider already is. */}
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
