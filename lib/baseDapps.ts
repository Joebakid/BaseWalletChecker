// lib/baseDapps.ts

// 1) Extend the key type
export type DappKey = "uniswap" | "aerodrome" | "stargate" | "zerion";

// 2) Human-readable labels for UI
export const DAPP_LABELS: Record<DappKey, string> = {
  uniswap: "Uniswap",
  aerodrome: "Aerodrome",
  stargate: "Stargate",
  zerion: "Zerion",
};

// 3) Store ALL addresses LOWERCASED to avoid checksum/casing mismatches
export const DAPP_CONTRACTS: Record<DappKey, string[]> = {
  uniswap: [
    "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45", // SwapRouter02 (common)
    "0x2626664c2603336e57b271c5c0b26f421741e481", // Uniswap v3 periphery (Base)
    "0x6ff5693b99212da76ad316178a184ab56d299b43", // Universal Router (Base)
    "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad", // Your provided Uniswap addr
  ].map((a) => a.toLowerCase()),

  aerodrome: [
    "0xcf77a3ba9a5ca399b7c97c74d54e5b1beb874e43", // Aerodrome router
  ].map((a) => a.toLowerCase()),

  stargate: [
    "0x45f1a95a4d3f3836523f5c83673c797f4d4d263b", // Router
    "0x50b6ebc2103bfec165949cc946d739d5650d7ae4", // RouterETH
    "0x45a01e4e04f14f7a4a6702c74187c5f6222033cd", // Legacy/omni router
  ].map((a) => a.toLowerCase()),

  zerion: [
    "0xd7f1dd5d49206349cae8b585fcb0ce3d96f1696f", // Your provided Zerion addr
  ].map((a) => a.toLowerCase()),
};

// 4) Reverse lookup (lowercased keys)
export const CONTRACT_TO_DAPP: Record<string, DappKey> = Object.entries(
  DAPP_CONTRACTS
).reduce((acc, [k, addrs]) => {
  addrs.forEach((a) => (acc[a.toLowerCase()] = k as DappKey));
  return acc;
}, {} as Record<string, DappKey>);

// 5) Helpers
export function dappFromAddress(addr?: string | null): DappKey | undefined {
  if (!addr) return undefined;
  return CONTRACT_TO_DAPP[addr.toLowerCase()];
}

export function dappLabel(addr?: string | null): string | undefined {
  const key = dappFromAddress(addr);
  return key ? DAPP_LABELS[key] : undefined;
}

// For tx objects that might have either `to` or `contractAddress`
export function dappFromTx(tx: { to?: string | null; contractAddress?: string | null }) {
  return dappFromAddress(tx?.to) ?? dappFromAddress(tx?.contractAddress);
}
