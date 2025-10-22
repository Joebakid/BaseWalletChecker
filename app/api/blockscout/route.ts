// app/api/blockscout/route.ts
import { NextRequest } from "next/server";

const BASE = "https://base.blockscout.com/api"; // native Base chain explorer API

export const runtime = "edge"; // fast & simple

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  // Forward all query params (module, action, address, page, offset, sort, etc.)
  const target = new URL(BASE);
  url.searchParams.forEach((v, k) => target.searchParams.set(k, v));

  // OPTIONAL: basic allowlist to avoid abuse; comment out if you prefer fully open
  const allowedModules = new Set(["account", "contract", "stats"]);
  const moduleParam = url.searchParams.get("module") || "";
  if (!allowedModules.has(moduleParam)) {
    return new Response(JSON.stringify({ status: "0", message: "module not allowed" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    const res = await fetch(target.toString(), {
      // Pass through without CORS headaches
      headers: { "accept": "application/json" },
      // Revalidate often if you like:
      // next: { revalidate: 15 },
    });

    // Propagate status + JSON
    const body = await res.text(); // keep text to pass through even if it's not JSON
    return new Response(body, {
      status: res.status,
      headers: { "content-type": res.headers.get("content-type") || "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ status: "0", message: "fetch_failed" }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }
}
