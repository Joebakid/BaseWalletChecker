// app/api/dapp-txs/route.ts
import { NextResponse } from "next/server";
import { CONTRACT_TO_DAPP } from "@/lib/baseDapps"; // your router map

const ETHERSCAN_V2 = "https://api.etherscan.io/v2/api";
const CHAINID_BASE = 8453;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const address = (searchParams.get("address") || "").trim();

    if (!address) {
      return NextResponse.json({ error: "address is required" }, { status: 400 });
    }

    const key = process.env.ETHERSCAN_API_KEY;
    if (!key) {
      return NextResponse.json({ error: "ETHERSCAN_API_KEY missing" }, { status: 500 });
    }

    // IMPORTANT: chainid (not chain) + 8453 for Base
    const url =
      `${ETHERSCAN_V2}?chainid=${CHAINID_BASE}` +
      `&module=account&action=txlist&address=${address}` +
      `&startblock=0&endblock=99999999&sort=desc&page=1&offset=10000&apikey=${key}`;

    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();

    // V2 still returns { status, message, result }
    if (json?.status !== "1" && !Array.isArray(json?.result)) {
      const msg = typeof json?.message === "string" ? json.message : "Etherscan error";
      return NextResponse.json({ error: msg, raw: json }, { status: 502 });
    }

    const txs: any[] = Array.isArray(json.result) ? json.result : [];

    // Count by known routers (to-address)
    const counts: Record<string, number> = {};
    const unknown: Record<string, number> = {};

    for (const t of txs) {
      const to = (t?.to || "").toLowerCase();
      if (!to) continue;
      const dapp = (CONTRACT_TO_DAPP as Record<string, string>)[to];
      if (dapp) counts[dapp] = (counts[dapp] || 0) + 1;
      else unknown[to] = (unknown[to] || 0) + 1;
    }

    const totalMatched = Object.values(counts).reduce((a, b) => a + b, 0);
    const summaryByDapp = Object.fromEntries(
      Object.entries(counts).sort((a, b) => b[1] - a[1])
    );
    const topUnknown = Object.entries(unknown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([to, count]) => ({ to, count }));

    return NextResponse.json({ address, totalMatched, summaryByDapp, topUnknown });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
