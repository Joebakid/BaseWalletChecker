// minikit.config.ts
export const minikitConfig = {
  accountAssociation: {
    // ⬇️ Paste the real values after signing with the Base Account Association tool
    header: "",
    payload: "",
    signature: "",
  },
  miniapp: {
    version: "1",
    name: "Base Wallet Checker",
    subtitle: "Quick wallet insights",
    description: "Analyze Base wallet activity quickly — dApps, tokens, fees & volume.",
    screenshotUrls: [`${process.env.NEXT_PUBLIC_ROOT_URL}/og.png`],
    iconUrl: `${process.env.NEXT_PUBLIC_ROOT_URL}/icon.png`,
    splashImageUrl: `${process.env.NEXT_PUBLIC_ROOT_URL}/og.png`,
    splashBackgroundColor: "#000000",
    homeUrl: process.env.NEXT_PUBLIC_ROOT_URL,
    webhookUrl: `${process.env.NEXT_PUBLIC_ROOT_URL}/api/webhook`,
    primaryCategory: "utilities",
    tags: ["base", "wallet", "analytics"],
    heroImageUrl: `${process.env.NEXT_PUBLIC_ROOT_URL}/og.png`,
    tagline: "Check Base activity at a glance",
    ogTitle: "Base Wallet Checker",
    ogDescription: "Analyze Base wallet activity quickly — track dApps, tokens, fees & more.",
    ogImageUrl: `${process.env.NEXT_PUBLIC_ROOT_URL}/og.png`,
  },
} as const;
