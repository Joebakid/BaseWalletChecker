// app/api/price/route.ts
import { NextResponse } from "next/server";

// Cache 60s; run dynamically so we can hit public APIs
export const revalidate = 60;
export const dynamic = "force-dynamic";

async function fetchJson(url: string, init?: RequestInit) {
  const res = await fetch(url, {
    headers: { "User-Agent": "BaseWalletChecker/1.0", ...(init?.headers || {}) },
    // @ts-ignore next router option
    next: { revalidate: 60 },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${url} -> ${res.status} ${text.slice(0, 200)}`);
  }
  return res.json();
}

async function getEthUsd(): Promise<number> {
  // 1) Coinbase (no key)
  try {
    const cb = await fetchJson("https://api.coinbase.com/v2/prices/ETH-USD/spot");
    const v = Number(cb?.data?.amount);
    if (v && Number.isFinite(v)) return v;
  } catch {}

  // 2) Binance (no key)
  try {
    const bz = await fetchJson("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT");
    const v = Number(bz?.price);
    if (v && Number.isFinite(v)) return v;
  } catch {}

  // 3) CryptoCompare (no key)
  try {
    const cc = await fetchJson("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD");
    const v = Number(cc?.USD);
    if (v && Number.isFinite(v)) return v;
  } catch {}

  // 4) CoinGecko simple price
  try {
    const cg = await fetchJson("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
    const v = Number(cg?.ethereum?.usd);
    if (v && Number.isFinite(v)) return v;
  } catch {}

  throw new Error("All price providers failed");
}

export async function GET() {
  try {
    const usd = await getEthUsd();
    return NextResponse.json({ "base-eth": { usd } }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Price fetch failed" }, { status: 502 });
  }
}
