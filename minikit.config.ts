// minikit.config.ts
export const minikitConfig = {
 
  "accountAssociation": {
    "header": "eyJmaWQiOjExMzc4NTAsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg3REU4YjljYTNhNDFjMDcyMWQzOUZBRmVhN2Q0ZjY0MDUzZDREZjUxIn0",
    "payload": "eyJkb21haW4iOiJjaHVjay1taW5pLWFwcC52ZXJjZWwuYXBwIn0",
    "signature": "t+ey+IWdxSTWbQj5ZM+PprxqvK6pRG57Fi77vUNsumUjXfFrx5Ozo/ulDVqZ00zrTxdQPZiq8J978kr69Nsqohs="
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
