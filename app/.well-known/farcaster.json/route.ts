// app/.well-known/farcaster.json/route.ts
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
  const { protocol, host } = new URL(request.url);
  const origin = `${protocol}//${host}`;

  // Replace with your actual signed values from Base Account Association tool
  const accountAssociation = {
    header: "",
    payload: "",
    signature: "",
  };

  const body = {
    accountAssociation,
    miniapp: {
      version: "1",
      name: "Base Wallet Checker",
      subtitle: "Quick wallet insights",
      description: "Analyze Base wallet activity quickly.",
      screenshotUrls: [`${origin}/og.png`],
      iconUrl: `${origin}/icon.png`,
      splashImageUrl: `${origin}/og.png`,
      splashBackgroundColor: "#000000",
      homeUrl: origin,
      webhookUrl: `${origin}/api/webhook`,
      primaryCategory: "utilities",
      tags: ["base", "wallet", "analytics"],
      heroImageUrl: `${origin}/og.png`,
      tagline: "Base wallet analytics",
      ogTitle: "Base Wallet Checker",
      ogDescription: "Analyze Base wallet activity quickly.",
      ogImageUrl: `${origin}/og.png`,
    },
  };

  return new NextResponse(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
