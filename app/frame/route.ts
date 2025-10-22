// app/frame/route.ts
export const runtime = "edge";

// Make everything absolute so Frames clients are happy
function abs(base: string, path: string) {
  try {
    return new URL(path, base).toString();
  } catch {
    return path; // fallback
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = `${url.protocol}//${url.host}`; // e.g. https://base-walletchecker.vercel.app

  const ogImage = abs(origin, "/og.png");      // MUST be absolute
  const target  = abs(origin, "/");            // where the button should open

  // Minimal, valid “link” frame
  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta property="og:title" content="Base Wallet Checker" />
    <meta property="og:description" content="Analyze Base wallet activity quickly." />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:url" content="${origin}/frame" />
    <meta name="twitter:card" content="summary_large_image" />

    <!-- Farcaster Frame vNext -->
    <meta name="fc:frame" content="vNext" />
    <meta name="fc:frame:image" content="${ogImage}" />
    <meta name="fc:frame:button:1" content="Open App" />
    <meta name="fc:frame:button:1:action" content="link" />
    <meta name="fc:frame:button:1:target" content="${target}" />
  </head>
  <body style="margin:0;background:#000;color:#fff;">
    <!-- Optional fallback content -->
  </body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",     // ✅ must be HTML
      "cache-control": "no-store, max-age=0",         // avoid caching while testing
    },
  });
}
