// app/frame/route.ts
export const runtime = "edge";

export async function GET() {
  const og = "https://base-walletchecker.vercel.app/og.png"; // make sure this exists
  const target = "https://base-walletchecker.vercel.app/";   // your app

  const html = `<!doctype html>
<html>
  <head>
    <meta property="og:title" content="Base Wallet Checker" />
    <meta property="og:image" content="${og}" />
    <meta name="fc:frame" content="vNext" />
    <meta name="fc:frame:image" content="${og}" />
    <meta name="fc:frame:button:1" content="Open App" />
    <meta name="fc:frame:button:1:action" content="link" />
    <meta name="fc:frame:button:1:target" content="${target}" />
  </head>
  <body></body>
</html>`;

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}
