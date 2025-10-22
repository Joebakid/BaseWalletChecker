// lib/api.ts

// Use your proxy route instead of direct Blockscout
export const BASE_BLOCKSCOUT = "/api/blockscout";

export const COINGECKO_PRICE =
  "https://api.coingecko.com/api/v3/simple/price?ids=base-eth&vs_currencies=usd";

export async function fetchJSON<T = any>(url: string): Promise<T> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (err: any) {
    console.error("fetchJSON error:", err.message);
    throw err;
  }
}
