// lib/baseDapps.ts
export type DappKey = "uniswap" | "aerodrome" | "stargate";

export const DAPP_LABELS: Record<DappKey, string> = {
  uniswap: "Uniswap",
  aerodrome: "Aerodrome",
  stargate: "Stargate",
};

// Add multiple commonly used router entrypoints on Base.
// (These vary by deployment; we’ll also add a debugger in Step 2.)
export const DAPP_CONTRACTS: Record<DappKey, string[]> = {
  uniswap: [
    "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45", // SwapRouter02 (multi-chain common)
    "0x2626664c2603336e57b271c5c0b26f421741e481", // Uniswap v3 periphery on Base
    "0x6ff5693b99212da76ad316178a184ab56d299b43", // Universal Router (Base)
  ],
  aerodrome: [
    "0xcf77a3ba9a5ca399b7c97c74d54e5b1beb874e43", // Aerodrome router
  ],
  stargate: [
    "0x45f1a95a4d3f3836523f5c83673c797f4d4d263b", // Router
    "0x50b6ebc2103bfec165949cc946d739d5650d7ae4", // RouterETH
    "0x45a01e4e04f14f7a4a6702c74187c5f6222033cd", // legacy/omni router often reused
  ],
};

export const CONTRACT_TO_DAPP: Record<string, DappKey> = Object.entries(
  DAPP_CONTRACTS
).reduce((acc, [k, addrs]) => {
  addrs.forEach((a) => (acc[a] = k as DappKey));
  return acc;
}, {} as Record<string, DappKey>);
