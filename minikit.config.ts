export const minikitConfig = {
  "accountAssociation": {
    "header": "eyJmaWQiOjExMzc4NTAsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg3REU4YjljYTNhNDFjMDcyMWQzOUZBRmVhN2Q0ZjY0MDUzZDREZjUxIn0",
    "payload": "eyJkb21haW4iOiJiYXNlLXdhbGxldGNoZWNrZXIudmVyY2VsLmFwcCJ9",
    "signature": "8kKlE+aniNmV0AuZchf+z3QdzbgI9M2G/tiTRlWKAjllDZb+emJKXbE5ovYE6MT6kf+NsDM3HoG4YZcwILNToxw="
  },
  miniapp: {
    version: "1",
    name: "Cubey", 
    subtitle: "Your AI Ad Companion", 
    description: "Ads",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/blue-icon.png`,
    splashImageUrl: `${ROOT_URL}/blue-hero.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: ["marketing", "ads", "quickstart", "waitlist"],
    heroImageUrl: `${ROOT_URL}/blue-hero.png`, 
    tagline: "",
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: `${ROOT_URL}/blue-hero.png`,
  },
} as const;