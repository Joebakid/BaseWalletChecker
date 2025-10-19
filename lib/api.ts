// lib/api.ts
export const BASE_BLOCKSCOUT = "https://base.blockscout.com/api";
export const COINGECKO_PRICE =
  "https://api.coingecko.com/api/v3/simple/price?ids=base-eth&vs_currencies=usd";

export async function fetchJSON<T = any>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}
