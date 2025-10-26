// app/frame/route.ts
export const runtime = "edge";

export async function GET(request: Request) {
  const { protocol, host } = new URL(request.url);
  const origin = `${protocol}//${host}`;

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Base Wallet Checker</title>

    <!-- Open Graph -->
    <meta property="og:title" content="Base Wallet Checker" />
    <meta property="og:description" content="Analyze Base wallet activity quickly." />
    <meta property="og:image" content="${origin}/og.png" />
    <meta property="og:url" content="${origin}/frame" />
    <meta name="twitter:card" content="summary_large_image" />

    <!-- ✅ Farcaster Frame vNext -->
    <meta name="fc:frame" content="vNext" />
    <meta name="fc:frame:image" content="${origin}/og.png" />
    <meta name="fc:frame:image:aspect_ratio" content="1.91:1" />

    <!-- Button -->
    <meta name="fc:frame:button:1" content="Open App" />
    <meta name="fc:frame:button:1:action" content="link" />
    <meta name="fc:frame:button:1:target" content="${origin}/" />
  </head>
  <body style="margin:0;background:#000;color:#fff;"></body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
