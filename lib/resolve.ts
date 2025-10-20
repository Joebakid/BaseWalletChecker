// lib/resolve.ts
export function isHexAddr(s: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(s.trim());
}

/**
 * Resolve ENS (.eth) & Base names (.base) to a 0x address.
 * - .eth uses ENSIdeas (public, no key)
 * - .base uses OnchainKit (needs key) fallback-friendly
 *
 * Return: lowercase 0x… address or null if not resolvable.
 */
export async function resolveName(input: string): Promise<string | null> {
  const name = input.trim().toLowerCase();

  // already an address
  if (isHexAddr(name)) return name;

  // ENS (.eth) via ENSIdeas (public)
  if (name.endsWith(".eth")) {
    try {
      const r = await fetch(`https://api.ensideas.com/ens/resolve/${encodeURIComponent(name)}`);
      if (!r.ok) throw new Error("ensideas error");
      const data = await r.json();
      const addr = (data?.address || "").toLowerCase();
      return isHexAddr(addr) ? addr : null;
    } catch {
      return null;
    }
  }

  // Base names (.base) — OnchainKit (requires API key)
  // Get a key at: https://onchainkit.xyz (free tier available)
  // Put it in NEXT_PUBLIC_ONCHAINKIT_KEY
  if (name.endsWith(".base")) {
    const key = process.env.NEXT_PUBLIC_ONCHAINKIT_KEY;
    if (!key) {
      // No key configured — bail gracefully
      return null;
    }
    try {
      // Docs: https://docs.base.org/base-name-service/
      // OnchainKit ID API (basenames):
      const r = await fetch(
        `https://api.onchainkit.xyz/v1/id/basenames/resolve?name=${encodeURIComponent(name)}`,
        { headers: { Authorization: `Bearer ${key}` } }
      );
      if (!r.ok) throw new Error("onchainkit error");
      const data = await r.json();
      const addr = (data?.address || data?.ownerAddress || "").toLowerCase();
      return isHexAddr(addr) ? addr : null;
    } catch {
      return null;
    }
  }

  // Unknown suffix — not resolvable here
  return null;
}
