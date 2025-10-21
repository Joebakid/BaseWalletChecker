// lib/contractMeta.ts
import { dappLabel } from "./baseDapps";
import { BASE_BLOCKSCOUT, fetchJSON } from "./api";

/**
 * In-memory cache so we don't spam the explorer.
 */
const nameCache = new Map<string, string | undefined>();

/**
 * Returns a friendly label for an address:
 * 1) If it's in our DAPP map, returns that label (e.g., "Uniswap").
 * 2) Otherwise, fetches contract name from Blockscout and caches it.
 */
export async function getContractLabel(addr?: string | null): Promise<string | undefined> {
  if (!addr) return undefined;
  const a = addr.toLowerCase();

  // try our curated map first
  const known = dappLabel(a);
  if (known) return known;

  if (nameCache.has(a)) return nameCache.get(a);

  try {
    const url = `${BASE_BLOCKSCOUT}/api?module=contract&action=getsourcecode&address=${a}`;
    const res = await fetchJSON(url);
    const row = Array.isArray(res?.result) ? res.result[0] : undefined;

    // Blockscout often fills ContractName; sometimes it's "" for EOAs
    const candidate =
      row?.ContractName ||
      row?.ImplementationName ||
      row?.Proxy ||
      undefined;

    const cleaned = candidate && candidate !== " " ? String(candidate) : undefined;
    nameCache.set(a, cleaned);
    return cleaned;
  } catch {
    nameCache.set(a, undefined);
    return undefined;
  }
}

/**
 * Utility to shorten an address for display.
 */
export function shortAddr(a?: string | null, n = 4) {
  if (!a) return "";
  const s = a.toLowerCase();
  return `${s.slice(0, 2 + n)}…${s.slice(-n)}`;
}
