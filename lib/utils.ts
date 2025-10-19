// lib/utils.ts
export const weiToEth = (wei: string | number) => Number(wei) / 1e18;
export const fmt = (n: number, max = 6) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: max }).format(n);
export const isEthAddr = (s: string) => /^0x[a-fA-F0-9]{40}$/.test(s.trim());
export const nowSec = () => Math.floor(Date.now() / 1000);
