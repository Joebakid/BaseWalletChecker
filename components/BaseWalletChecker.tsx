// components/BaseWalletChecker.tsx
"use client";

import React, { useMemo, useState } from "react";
import Stat from "@/components/Stat";
import { BASE_BLOCKSCOUT, fetchJSON } from "@/lib/api";
import { fmt, isEthAddr, weiToEth } from "@/lib/utils";
import InfoNote from "./InfoNote";
import { resolveName } from "@/lib/resolve";

/* --------------------------- dApp types/helpers --------------------------- */
type DappApi = {
  address: string;
  totalMatched: number;
  summaryByDapp: Record<string, number>;
  topUnknown?: { to: string; count: number }[];
};

function topDappsLabel(summary: Record<string, number>): string {
  const arr = Object.entries(summary).sort((a, b) => b[1] - a[1]).slice(0, 3);
  if (arr.length === 0) return "—";
  return arr.map(([name, n]) => `${name} ${n}`).join(" • ");
}

/* ----------------------------- Data structures ---------------------------- */
type Tx = {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  timeStamp: string;
  isError?: string;
  gasPrice?: string;
  gasUsed?: string;
};

type TokenTx = {
  hash: string;
  from: string;
  to: string;
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  value: string;
  timeStamp: string;
};

type NftTx = {
  hash: string;
  from: string;
  to: string;
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenID: string;
  timeStamp: string;
};

type TokenStat = {
  contract: string;
  name: string;
  symbol: string;
  in: number;
  out: number;
  total: number;
  count: number;
};

/* ------------------------------- Utilities -------------------------------- */
function paginate<T>(arr: T[], page: number, pageSize: number) {
  const total = arr.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  return { slice: arr.slice(start, end), total, totalPages, page: safePage, start: start + 1, end };
}

const BASE_MAINNET_LAUNCH = 1691539200;

const KNOWN_BRIDGES = new Set<string>([
  // "0x4200000000000000000000000000000000000010",
]);
function isBridge(addr?: string | null) {
  if (!addr) return false;
  return KNOWN_BRIDGES.has(addr.toLowerCase());
}

async function fetchPaged<T>(
  action: string,
  address: string,
  sort: "asc" | "desc" = "desc",
  pageLimit = 10,
  offset = 10000
) {
  const out: T[] = [];
  for (let page = 1; page <= pageLimit; page++) {
    const url = `${BASE_BLOCKSCOUT}?module=account&action=${action}&address=${address}&page=${page}&offset=${offset}&sort=${sort}`;
    const data = await fetchJSON<{ result: T[] }>(url);
    const arr = Array.isArray(data?.result) ? data.result : [];
    out.push(...arr);
    if (arr.length < offset) break;
  }
  return out;
}

/* --------------------------------- Component ------------------------------- */
export default function BaseWalletChecker() {
  const [addr, setAddr] = useState("");
  const [resolvedAddr, setResolvedAddr] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nativeTxs, setNativeTxs] = useState<Tx[] | null>(null);
  const [tokenTxs, setTokenTxs] = useState<TokenTx[] | null>(null);
  const [nftTxs, setNftTxs] = useState<NftTx[] | null>(null);

  const [usdPrice, setUsdPrice] = useState<number | null>(null);
  const [balanceEth, setBalanceEth] = useState<number | null>(null);

  // pagination state (UI)
  const [nativePage, setNativePage] = useState(1);
  const [tokenPage, setTokenPage] = useState(1);
  const [nativePageSize, setNativePageSize] = useState(10);
  const [tokenPageSize, setTokenPageSize] = useState(10);

  // dApp stats
  const [dappCount, setDappCount] = useState<number>(0);
  const [dappSummary, setDappSummary] = useState<Record<string, number>>({});
  const [dappUnknown, setDappUnknown] = useState<{ to: string; count: number }[]>([]);

  const lowerAddr = (resolvedAddr || addr).trim().toLowerCase();

  // Helper: ETH to "X ETH ($Y)" string
  function ethWithUsd(eth: number | null | undefined) {
    const e = Number(eth || 0);
    if (!usdPrice) return `${fmt(e)} ETH`;
    const usd = e * usdPrice;
    return `${fmt(e)} ETH ($${fmt(usd)})`;
  }

  async function fetchAll() {
    setLoading(true);
    setError(null);
    setNativeTxs(null);
    setTokenTxs(null);
    setNftTxs(null);
    setBalanceEth(null);
    setDappCount(0);
    setDappSummary({});
    setDappUnknown([]);
    setNativePage(1);
    setTokenPage(1);

    try {
      const input = addr.trim();
      const resolved = await resolveName(input);
      const a = resolved || input;

      if (!isEthAddr(a)) {
        throw new Error(
          input.endsWith(".eth") || input.endsWith(".base")
            ? "Could not resolve that name to an address. or name doesnot exist"
            : "Enter a valid Base address (0x...) or a .eth / .base name."
        );
      }
      setResolvedAddr(a);

      const since = BASE_MAINNET_LAUNCH;

      // Blockscout pages
      const txsAll = await fetchPaged<Tx>("txlist", a, "desc", 10);
      const toksAll = await fetchPaged<TokenTx>("tokentx", a, "desc", 10);
      const nftsAll = await fetchPaged<NftTx>("tokennfttx", a, "desc", 10);

      const txsInRange = txsAll.filter((t) => t.isError !== "1" && Number(t.timeStamp) >= since);
      const toksInRange = toksAll.filter((t) => Number(t.timeStamp) >= since);
      const nftsInRange = nftsAll.filter((t) => Number(t.timeStamp) >= since);

      // Parallel: dApp stats + balance + price (from our server route)
      const balUrl = `${BASE_BLOCKSCOUT}?module=account&action=balance&address=${a}`;
      const [dappRes, balData, priceData] = await Promise.all([
        fetch(`/api/dapp-txs?address=${a}`, { method: "GET", cache: "no-store" }).then((r) =>
          r.ok ? r.json().catch(() => null) : Promise.resolve(null)
        ),
        fetchJSON<{ result: string }>(balUrl).catch(() => ({ result: "0" })),
        fetchJSON<any>("/api/price").catch(() => null),
      ]);

      const dapps: DappApi = dappRes || { address: a, totalMatched: 0, summaryByDapp: {}, topUnknown: [] };
      setDappCount(dapps?.totalMatched || 0);
      setDappSummary(dapps?.summaryByDapp || {});
      setDappUnknown(dapps?.topUnknown || []);

      try {
        const wei = BigInt(balData?.result ?? "0");
        setBalanceEth(Number(wei) / 1e18);
      } catch {
        setBalanceEth(null);
      }

      setUsdPrice(Number(priceData?.["base-eth"]?.usd) || null);

      setNativeTxs(txsInRange);
      setTokenTxs(toksInRange);
      setNftTxs(nftsInRange);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  /* ----------------------------- Aggregations ----------------------------- */
  const nativeStats = useMemo(() => {
    if (!nativeTxs) return null;
    let incoming = 0;
    let outgoing = 0;
    for (const t of nativeTxs) {
      const vEth = weiToEth(t.value);
      if (t.to && t.to.toLowerCase() === lowerAddr) incoming += vEth;
      else outgoing += vEth;
    }
    const total = incoming + outgoing;
    return { in: incoming, out: outgoing, total, count: nativeTxs.length };
  }, [nativeTxs, lowerAddr]);

  const feeSpentEth = useMemo(() => {
    if (!nativeTxs) return 0;
    let weiTotal = 0;
    for (const t of nativeTxs) {
      const sentByUser = t.from?.toLowerCase() === lowerAddr;
      if (!sentByUser) continue;
      const gP = Number(t.gasPrice || 0);
      const gU = Number(t.gasUsed || 0);
      if (gP && gU) weiTotal += gP * gU;
    }
    return weiTotal / 1e18;
  }, [nativeTxs, lowerAddr]);

  const tokenStats = useMemo<TokenStat[] | null>(() => {
    if (!tokenTxs) return null;
    const map = new Map<string, { name: string; symbol: string; in: number; out: number; count: number }>();
    for (const t of tokenTxs) {
      const key = t.contractAddress.toLowerCase();
      const dec = Number(t.tokenDecimal || 18);
      const amt = Number(t.value) / 10 ** dec;
      if (!map.has(key)) map.set(key, { name: t.tokenName, symbol: t.tokenSymbol, in: 0, out: 0, count: 0 });
      const rec = map.get(key)!;
      if (t.to?.toLowerCase() === lowerAddr) rec.in += amt;
      else rec.out += amt;
      rec.count += 1;
    }
    const arr: TokenStat[] = Array.from(map.entries())
      .map(([contract, v]) => ({ contract, ...v, total: v.in + v.out }))
      .sort((a, b) => b.total - a.total);
    return arr;
  }, [tokenTxs, lowerAddr]);

  const totalBaseTxs = (nativeTxs?.length || 0) + (tokenTxs?.length || 0);
  const nativeVolumeEth = nativeStats ? nativeStats.total : 0;
  const nativeVolumeUsd = usdPrice ? nativeVolumeEth * usdPrice : null;
  const feeSpentUsd = usdPrice ? feeSpentEth * usdPrice : null;
  const balanceUsd = usdPrice && balanceEth != null ? balanceEth * usdPrice : null;

  const contractsDeployed = useMemo(() => {
    if (!nativeTxs) return 0;
    return nativeTxs.filter((t) => !t.to || t.to === "0x0000000000000000000000000000000000000000").length;
  }, [nativeTxs]);

  const nftTransferCount = nftTxs?.length || 0;

  const peerSet = useMemo(() => {
    const s = new Set<string>();
    const add = (a?: string | null) => {
      if (!a) return;
      const la = a.toLowerCase();
      if (la !== lowerAddr) s.add(la);
    };
    nativeTxs?.forEach((t) => { add(t.from); add(t.to); });
    tokenTxs?.forEach((t) => { add(t.from); add(t.to); });
    nftTxs?.forEach((t) => { add(t.from); add(t.to); });
    return s;
  }, [nativeTxs, tokenTxs, nftTxs, lowerAddr]);

  const daysActive = useMemo(() => {
    const ds = new Set<string>();
    const push = (ts: number) => {
      const d = new Date(ts * 1000);
      ds.add(`${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`);
    };
    nativeTxs?.forEach((t) => push(Number(t.timeStamp)));
    tokenTxs?.forEach((t) => push(Number(t.timeStamp)));
    nftTxs?.forEach((t) => push(Number(t.timeStamp)));
    return ds.size;
  }, [nativeTxs, tokenTxs, nftTxs]);

  const bridgedInEth = useMemo(() => {
    if (!nativeTxs) return 0;
    let sum = 0;
    for (const t of nativeTxs) {
      const incoming = t.to && t.to.toLowerCase() === lowerAddr;
      if (incoming && isBridge(t.from)) sum += weiToEth(t.value);
    }
    return sum;
  }, [nativeTxs, lowerAddr]);

  type BridgedToken = { contract: string; symbol: string; name: string; amount: number };
  const bridgedInTokens = useMemo<BridgedToken[]>(() => {
    if (!tokenTxs) return [];
    const map = new Map<string, BridgedToken>();
    for (const t of tokenTxs) {
      const incoming = t.to?.toLowerCase() === lowerAddr;
      if (!(incoming && isBridge(t.from))) continue;
      const dec = Number(t.tokenDecimal || 18);
      const amt = Number(t.value) / 10 ** dec;
      const key = t.contractAddress.toLowerCase();
      if (!map.has(key)) map.set(key, { contract: key, symbol: t.tokenSymbol, name: t.tokenName, amount: 0 });
      map.get(key)!.amount += amt;
    }
    return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
  }, [tokenTxs, lowerAddr]);

  const airdropPercent = useMemo(() => {
    const txCount = totalBaseTxs;
    const txScore = Math.min(txCount / 100, 1);
    const tokenScore = Math.min((tokenTxs?.length || 0) / 80, 1);
    const volScore = Math.min((nativeVolumeUsd || 0) / 5000, 1);
    const peersScore = Math.min(peerSet.size / 50, 1);
    const cadenceScore = Math.min(daysActive / 40, 1);
    const balanceScore = Math.min((balanceUsd || 0) / 1000, 1);
    const wTx = 0.2, wTok = 0.1, wVol = 0.25, wPeers = 0.15, wCad = 0.1, wBal = 0.2;
    const score =
      wTx * txScore +
      wTok * tokenScore +
      wVol * volScore +
      wPeers * peersScore +
      wCad * cadenceScore +
      wBal * balanceScore;
    return Math.round(score * 100);
  }, [totalBaseTxs, tokenTxs, nativeVolumeUsd, peerSet.size, daysActive, balanceUsd]);

  const nativePaged = useMemo(() => {
    if (!nativeTxs || nativeTxs.length === 0) {
      return { slice: [] as Tx[], total: 0, totalPages: 1, page: 1, start: 0, end: 0 };
    }
    return paginate(nativeTxs, nativePage, nativePageSize);
  }, [nativeTxs, nativePage, nativePageSize]);

  const tokenPaged = useMemo(() => {
    if (!tokenStats || tokenStats.length === 0) {
      return { slice: [] as TokenStat[], total: 0, totalPages: 1, page: 1, start: 0, end: 0 };
    }
    return paginate(tokenStats, tokenPage, tokenPageSize);
  }, [tokenStats, tokenPage, tokenPageSize]);

  /* ----------------------------------- UI ---------------------------------- */
  return (
    <>
      {loading && <LoaderOverlay message="Checking transactions on Base…" />}

      <section className="mt-6 rounded-2xl border border-gray-800 bg-black text-gray-100 p-4 sm:p-5">
        <p className="text-sm text-gray-300">
          Uses{" "}
          <a className="underline" href="https://base.blockscout.com/" target="_blank" rel="noreferrer">
            Blockscout
          </a>{" "}
          API + Coinbase/Binance price (no key).
        </p>

        <div className="mt-4">
          <label className="block text-xs uppercase text-gray-400 mb-1">Address</label>
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <input
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 outline-none focus:outline-none focus:ring-0"
                placeholder="Enter 0x..., ENS (.eth), or Base name (.base)"
                value={addr}
                onChange={(e) => setAddr(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    e.preventDefault();
                    fetchAll();
                  }
                }}
              />
            </div>
            <button
              onClick={fetchAll}
              disabled={loading}
              className="h-[42px] rounded-xl border border-gray-800 bg-white text-black px-4 py-2 disabled:opacity-60"
            >
              {loading ? "Checking..." : "Check"}
            </button>
          </div>

          {resolvedAddr && resolvedAddr.toLowerCase() !== addr.trim().toLowerCase() && (
            <div className="mt-1 text-xs text-gray-400">
              Address: <span className="text-gray-200 break-all">{resolvedAddr}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-800 bg-red-950/40 p-3 text-red-300">
            {error}
          </div>
        )}

        {(nativeStats || tokenStats) && (
          <section className="mt-6">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Overview</h2>
              <InfoNote />
            </div>

            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <Stat label="Total Base txs" value={totalBaseTxs} />
              <Stat label="Native volume" value={ethWithUsd(nativeVolumeEth)} />
              <Stat label="Unique peers" value={peerSet.size} />
              <Stat label="Days active" value={daysActive} />
              <Stat label="Bridged in (ETH)" value={ethWithUsd(bridgedInEth)} />
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <Stat label="Est. airdrop %" value={`${airdropPercent}%`} />
              <Stat label="Native tx count" value={nativeStats ? nativeStats.count : 0} />
              <Stat label="Token transfers" value={tokenTxs ? tokenTxs.length : 0} />
              <Stat label="NFT transfers" value={nftTransferCount} />
              <Stat label="dApp txs" value={dappCount} sub={topDappsLabel(dappSummary)} />
            </div>

      

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <Stat label="Contracts deployed" value={contractsDeployed} />
              <Stat label="Fee spent" value={ethWithUsd(feeSpentEth)} />
              <Stat label="ETH balance" value={balanceEth != null ? ethWithUsd(balanceEth) : "—"} />
              <Stat label="Stake / Liquidity" value="—" sub="Needs protocol maps" />
            </div>

            {bridgedInTokens.length > 0 && (
              <div className="mt-3 text-xs text-gray-300">
                <div className="font-medium mb-1">Bridged in (ERC-20):</div>
                <ul className="list-disc list-inside space-y-0.5">
                  {bridgedInTokens.slice(0, 6).map((t) => (
                    <li key={t.contract}>
                      {t.symbol} <span className="text-gray-400">({t.name})</span>: {fmt(t.amount)}
                    </li>
                  ))}
                  {bridgedInTokens.length > 6 && <li className="text-gray-400">+{bridgedInTokens.length - 6} more</li>}
                </ul>
              </div>
            )}
          </section>
        )}

        {nativeStats && nativeTxs && nativeTxs.length > 0 && (
          <section className="mt-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
              <h2 className="text-lg font-semibold">Native Transfers (ETH on Base)</h2>
              <PageControls
                page={nativePaged.page}
                totalPages={nativePaged.totalPages}
                onPrev={() => setNativePage((p) => Math.max(1, p - 1))}
                onNext={() => setNativePage((p) => Math.min(nativePaged.totalPages, p + 1))}
              />
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <Stat label="Incoming" value={ethWithUsd(nativeStats.in)} />
              <Stat label="Outgoing" value={ethWithUsd(nativeStats.out)} />
              <Stat label="Total moved" value={ethWithUsd(nativeStats.total)} />
              <div className="flex items-center justify-end">
                <PageSizeSelect
                  label="Rows"
                  value={nativePageSize}
                  onChange={(n) => {
                    setNativePageSize(n);
                    setNativePage(1);
                  }}
                />
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-400">
              {nativePaged.total > 0
                ? `Showing ${nativePaged.start}–${nativePaged.end} of ${nativePaged.total}`
                : "No rows"}
            </div>



                  {dappCount === 0 && dappUnknown.length > 0 && (
              <div className="mt-2 text-[11px] text-gray-500">
                Top unknown <code>to</code> addresses from your txs  
                <ul className="list-disc list-inside space-y-0.5">
                  {dappUnknown.slice(0, 5).map((u) => (
                    <li key={u.to}>
                      <a className="underline" href={`https://basescan.org/address/${u.to}`} target="_blank" rel="noreferrer">
                        {u.to}
                      </a>{" "}
                      — {u.count} tx
                    </li>
                  ))}
                </ul>
              </div>
            )}


            

            <div className="mt-2 overflow-x-auto rounded-xl border border-gray-800">
              <table className="min-w-[900px] text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-800 bg-gray-950">
                    <th className="py-2 pr-3">Time (UTC)</th>
                    <th className="py-2 pr-3">Dir</th>
                    <th className="py-2 pr-3">Amount</th>
                    <th className="py-2 pr-3">Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {nativePaged.slice.map((t) => {
                    const isIn = t.to && t.to.toLowerCase() === lowerAddr;
                    const vEth = weiToEth(t.value);
                    const prefix = isIn ? "+" : "−";
                    const signed = `${prefix}${fmt(vEth)} ETH`;
                    const signedWithUsd =
                      usdPrice ? `${signed} ($${fmt(vEth * usdPrice)})` : signed;

                    return (
                      <tr key={t.hash} className="border-b border-gray-900">
                        <td className="py-2 pr-3 whitespace-nowrap">
                          {new Date(Number(t.timeStamp) * 1000).toUTCString()}
                        </td>
                        <td className="py-2 pr-3">
                          <span
                            className={
                              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium " +
                              (isIn
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-600/30"
                                : "bg-rose-500/10 text-rose-400 border border-rose-600/30")
                            }
                          >
                            {isIn ? "IN" : "OUT"}
                          </span>
                        </td>
                        <td
                          className={
                            "py-2 pr-3 whitespace-nowrap font-medium " +
                            (isIn ? "text-emerald-400" : "text-rose-400")
                          }
                        >
                          {signedWithUsd}
                        </td>
                        <td className="py-2 pr-3 whitespace-nowrap">
                          <a
                            className="underline text-xs break-all"
                            href={`https://base.blockscout.com/tx/${t.hash}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {t.hash}
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {!loading && !error && !nativeStats && (
          <p className="mt-8 text-sm text-gray-300">
            Enter an address and press <b>Enter</b> or click <b>Check</b> to see recent activity.
          </p>
        )}
      </section>
    </>
  );
}

/* ------------------------------- UI helpers ------------------------------- */
function PageControls({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="rounded-md border border-gray-800 px-2 py-1 disabled:opacity-50"
      >
        Prev
      </button>
      <span className="tabular-nums">
        {page} / {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="rounded-md border border-gray-800 px-2 py-1 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

function PageSizeSelect({
  label = "Rows",
  value,
  onChange,
  options = [5, 10, 20, 50],
}: {
  label?: string;
  value: number;
  onChange: (n: number) => void;
  options?: number[];
}) {
  return (
    <label className="text-sm text-gray-300 flex items-center gap-2">
      <span className="text-xs uppercase text-gray-400">{label}</span>
      <select
        className="rounded-md border border-gray-800 bg-gray-900 px-2 py-1 outline-none focus:outline-none focus:ring-0"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {options.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ------------------------------ Loader overlay ---------------------------- */
function LoaderOverlay({ message = "Loading…" }: { message?: string }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-gray-400 border-t-transparent animate-spin" />
        <div className="text-gray-100 text-sm">{message}</div>
      </div>
    </div>
  );
}
