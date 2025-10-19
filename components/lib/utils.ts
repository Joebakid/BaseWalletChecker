// lib/utils.ts

// ✅ tiny className joiner (no extra deps)
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// ---------- number & formatting helpers ----------
export function fmt(n: number, maxFractionDigits = 2) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: maxFractionDigits,
  }).format(n);
}

// ---------- EVM helpers ----------
export function isEthAddr(a?: string) {
  return !!a && /^0x[0-9a-fA-F]{40}$/.test(a);
}

export function weiToEth(wei: string | number) {
  const bn = typeof wei === "string" ? BigInt(wei) : BigInt(wei);
  // return as number for UI; for strict accuracy you could return string
  return Number(bn) / 1e18;
}

// (optional) if you used this before:
export function nowSec() {
  return Math.floor(Date.now() / 1000);
}
