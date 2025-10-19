// app/layout.tsx
import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";

export const metadata = {
  title: "Base Wallet Checker",
  description: "Frontend-only Base wallet checker using Blockscout (no accounts)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-black text-gray-100">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
