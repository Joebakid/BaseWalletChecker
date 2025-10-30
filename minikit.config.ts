// minikit.config.ts

export const minikitConfig = {
 
  

  "accountAssociation": {
    "header": "eyJmaWQiOjExMzc4NTAsInR5cGUiOiJhdXRoIiwia2V5IjoiMHgxRmZDMTQ0QzM2ZjU3OTNENDUyN2UzNWIwODAxODgzNDcyZTI3MGRCIn0",
    "payload": "eyJkb21haW4iOiJiYXNlLXdhbGxldGNoZWNrZXIudmVyY2VsLmFwcCJ9",
    "signature": "G8yHDXn92ywT3D+MXVgbtUFDxQqhMuP4K/min3sulYoQSryVyhUMD3mxDD0g1kzqLXWtRa9iypu7hZuT42nLrhw="
  }


,

  baseBuilder: {
    ownerAddress: "0x1c08A8A497ea9E2aAE3EE9d9b8e8b20D426DA085", // <-- replace with your Base account address
  },

  miniapp: {
    version: "1",
    name: "Base Wallet Checker",
    subtitle: "Quick wallet insights",
    description:
      "Analyze Base wallet activity quickly — dApps, tokens, fees & volume.",
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
    ogDescription:
      "Analyze Base wallet activity quickly — track dApps, tokens, fees & more.",
    ogImageUrl: `${process.env.NEXT_PUBLIC_ROOT_URL}/og.png`,
    noindex: true, // optional, hides from search if you want
  },
} as const;
