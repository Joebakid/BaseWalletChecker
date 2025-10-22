// app/frame/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const DOMAIN = 'https://base-walletchecker.vercel.app/';      
const OG = `${DOMAIN}/og.png`;             // optional preview image

export async function GET() {
  const html = `<!doctype html>
<html>
  <head>
    <meta property="og:title" content="BaseWallet Checker" />
    ${OG ? `<meta property="og:image" content="${OG}" />` : ''}

    <!-- Farcaster Frame vNext -->
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${OG}" />
    <meta property="fc:frame:button:1" content="Open App" />
    <meta property="fc:frame:button:1:target" content="${DOMAIN}" />
  </head>
  <body></body>
</html>`;
  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
