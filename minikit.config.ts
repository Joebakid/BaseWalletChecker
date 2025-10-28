// minikit.config.ts
export const minikitConfig = {
 
 
  "accountAssociation": {
    "header": "eyJmaWQiOjExMzc4NTAsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg3REU4YjljYTNhNDFjMDcyMWQzOUZBRmVhN2Q0ZjY0MDUzZDREZjUxIn0",
    "payload": "eyJkb21haW4iOiJiYXNlLXdhbGxldGNoZWNrZXIudmVyY2VsLmFwcCJ9",
    "signature": "8kKlE+aniNmV0AuZchf+z3QdzbgI9M2G/tiTRlWKAjllDZb+emJKXbE5ovYE6MT6kf+NsDM3HoG4YZcwILNToxw="
  }
,

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
