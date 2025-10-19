// components/BaseWalletChecker.tsx
"use client";

import React, { useMemo, useState } from "react";
import Stat from "@/components/Stat";
import { BASE_BLOCKSCOUT, COINGECKO_PRICE, fetchJSON } from "@/lib/api";
import { fmt, isEthAddr, nowSec, weiToEth } from "@/lib/utils";

type Tx = {
  hash: string;
  from: string;
  to: string | null;
  value: string;           // wei (string)
  timeStamp: string;       // unix seconds (string)
  isError?: string;        // "1" means failed
};

type TokenTx = {
  hash: string;
  from: string;
  to: string;
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;    // e.g. "6", "18"
  value: string;           // raw integer
  timeStamp: string;
};

export default function BaseWalletChecker() {
  const [addr, setAddr] = useState("");
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nativeTxs, setNativeTxs] = useState<Tx[] | null>(null);
  const [tokenTxs, setTokenTxs] = useState<TokenTx[] | null>(null);
  const [usdPrice, setUsdPrice] = useState<number | null>(null);

  const until = nowSec();
  const since = useMemo(() => until - days * 24 * 3600, [days, until]);
  const sinceNice = useMemo(() => new Date(since * 1000).toLocaleString(), [since]);
  const lowerAddr = addr.trim().toLowerCase();

  async function fetchAll() {
    setLoading(true);
    setError(null);
    setNativeTxs(null);
    setTokenTxs(null);
    try {
      const a = addr.trim();
      if (!isEthAddr(a)) throw new Error("Enter a valid Base address (0x...)");

      // Native transfers
      const txUrl = `${BASE_BLOCKSCOUT}?module=account&action=txlist&address=${a}&sort=desc`;
      const txData = await fetchJSON<{ result: Tx[] }>(txUrl);
      const txs = Array.isArray(txData?.result) ? txData.result : [];
      const txsInRange = txs.filter(
        (t) => t.isError !== "1" && Number(t.timeStamp) >= since
      );

      // ERC-20 transfers
      const tokUrl = `${BASE_BLOCKSCOUT}?module=account&action=tokentx&address=${a}&sort=desc`;
      const tokData = await fetchJSON<{ result: TokenTx[] }>(tokUrl);
      const toks = Array.isArray(tokData?.result) ? tokData.result : [];
      const toksInRange = toks.filter((t) => Number(t.timeStamp) >= since);

      // Price (optional)
      try {
        const priceData = await fetchJSON<any>(COINGECKO_PRICE);
        setUsdPrice(priceData?.["base-eth"]?.usd ?? null);
      } catch {
        setUsdPrice(null);
      }

      setNativeTxs(txsInRange);
      setTokenTxs(toksInRange);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // ---------- Aggregations ----------
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

  const tokenStats = useMemo(() => {
    if (!tokenTxs) return null;
    const map = new Map<
      string,
      { name: string; symbol: string; in: number; out: number; count: number }
    >();
    for (const t of tokenTxs) {
      const key = t.contractAddress.toLowerCase();
      const dec = Number(t.tokenDecimal || 18);
      const amt = Number(t.value) / 10 ** dec;
      if (!map.has(key))
        map.set(key, { name: t.tokenName, symbol: t.tokenSymbol, in: 0, out: 0, count: 0 });
      const rec = map.get(key)!;
      if (t.to?.toLowerCase() === lowerAddr) rec.in += amt;
      else rec.out += amt;
      rec.count += 1;
    }
    return Array.from(map.entries())
      .map(([contract, v]) => ({ contract, ...v, total: v.in + v.out }))
      .sort((a, b) => b.total - a.total);
  }, [tokenTxs, lowerAddr]);

  // KPIs
  const totalBaseTxs = (nativeTxs?.length || 0) + (tokenTxs?.length || 0);
  const nativeVolumeEth = nativeStats ? nativeStats.total : 0;
  const nativeVolumeUsd = usdPrice ? nativeVolumeEth * usdPrice : null;

  // Peer set (unique addresses interacted with)
  const peerSet = useMemo(() => {
    const s = new Set<string>();
    const add = (a?: string | null) => {
      if (!a) return;
      const la = a.toLowerCase();
      if (la !== lowerAddr) s.add(la);
    };
    nativeTxs?.forEach((t) => { add(t.from); add(t.to); });
    tokenTxs?.forEach((t) => { add(t.from); add(t.to); });
    return s;
  }, [nativeTxs, tokenTxs, lowerAddr]);

  // Days active
  const daysActive = useMemo(() => {
    const ds = new Set<string>();
    const push = (ts: number) => {
      const d = new Date(ts * 1000);
      ds.add(`${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`);
    };
    nativeTxs?.forEach((t) => push(Number(t.timeStamp)));
    tokenTxs?.forEach((t) => push(Number(t.timeStamp)));
    return ds.size;
  }, [nativeTxs, tokenTxs]);

  // Rough airdrop score (%)
  const airdropPercent = useMemo(() => {
    const txCount = totalBaseTxs;
    const txScore = Math.min(txCount / 50, 1);
    const tokenScore = Math.min((tokenTxs?.length || 0) / 50, 1);
    const volScore = Math.min((nativeVolumeUsd || 0) / 1000, 1);
    const peersScore = Math.min(peerSet.size / 25, 1);
    const cadenceScore = Math.min(daysActive / 20, 1);

    const w1 = 0.25, w2 = 0.15, w3 = 0.25, w4 = 0.2, w5 = 0.15;
    const score = w1 * txScore + w2 * tokenScore + w3 * volScore + w4 * peersScore + w5 * cadenceScore;
    return Math.round(score * 100);
  }, [totalBaseTxs, tokenTxs, nativeVolumeUsd, peerSet.size, daysActive]);

  // Suggested criteria
  const criteria = useMemo(() => {
    const todo: { label: string; pass: boolean }[] = [];
    todo.push({ label: "At least 25 total txs in lookback", pass: totalBaseTxs >= 25 });
    todo.push({ label: "≥ $250 native volume moved", pass: (nativeVolumeUsd || 0) >= 250 });
    todo.push({ label: "Interact with ≥ 10 unique addresses", pass: peerSet.size >= 10 });
    todo.push({ label: "Be active on ≥ 10 distinct days", pass: daysActive >= 10 });
    todo.push({ label: "Include ≥ 5 ERC-20 transfers", pass: (tokenTxs?.length || 0) >= 5 });
    return todo;
  }, [totalBaseTxs, nativeVolumeUsd, peerSet.size, daysActive, tokenTxs]);

  return (
    <section className="mt-6 rounded-2xl border border-gray-800 bg-black text-gray-100 p-5">
      <p className="text-sm text-gray-300">
        Uses{" "}
        <a className="underline" href="https://base.blockscout.com/" target="_blank" rel="noreferrer">
          Blockscout
        </a>{" "}
        API + CoinGecko. Data since <strong>{sinceNice}</strong>.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto_auto] items-end">
        <label className="block">
          <span className="text-xs uppercase text-gray-400">Address</span>
          <input
            className="mt-1 w-full rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 outline-none focus:ring focus:ring-gray-700"
            placeholder="0x..."
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-xs uppercase text-gray-400">Days</span>
          <input
            type="number"
            min={1}
            max={365}
            className="mt-1 w-24 rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 outline-none focus:ring focus:ring-gray-700"
            value={days}
            onChange={(e) =>
              setDays(Math.max(1, Math.min(365, Number(e.target.value) || 1)))
            }
          />
        </label>

        <button
          onClick={fetchAll}
          disabled={loading}
          className="rounded-xl border border-gray-800 bg-white text-black px-4 py-2 disabled:opacity-60"
        >
          {loading ? "Checking..." : "Check"}
        </button>

        {!!usdPrice && (
          <div className="text-right text-sm text-gray-300">
            BASE price: ${fmt(usdPrice, 4)}
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
          <h2 className="text-lg font-semibold">Overview</h2>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Total Base txs" value={totalBaseTxs} />
            <Stat
              label="Native volume"
              value={`${fmt(nativeVolumeEth)} ETH`}
              sub={usdPrice ? `$${fmt(nativeVolumeUsd || 0)}` : undefined}
            />
            <Stat label="Unique peers" value={peerSet.size} />
            <Stat label="Days active" value={daysActive} />
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Est. airdrop %" value={`${airdropPercent}%`} />
            <Stat label="Native tx count" value={nativeStats ? nativeStats.count : 0} />
            <Stat label="Token transfers" value={tokenTxs ? tokenTxs.length : 0} />
            <Stat label="Window (days)" value={days} />
          </div>
        </section>
      )}

      {nativeStats && nativeTxs && nativeTxs.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">Native Transfers (ETH on Base)</h2>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat
              label="Incoming"
              value={`${fmt(nativeStats.in)} ETH`}
              sub={usdPrice ? `$${fmt((nativeStats.in) * (usdPrice || 0))}` : undefined}
            />
            <Stat
              label="Outgoing"
              value={`${fmt(nativeStats.out)} ETH`}
              sub={usdPrice ? `$${fmt((nativeStats.out) * (usdPrice || 0))}` : undefined}
            />
            <Stat
              label="Total moved"
              value={`${fmt(nativeStats.total)} ETH`}
              sub={usdPrice ? `$${fmt((nativeStats.total) * (usdPrice || 0))}` : undefined}
            />
            <Stat label="Tx count" value={`${nativeStats.count}`} />
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-gray-800">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-800 bg-gray-950">
                  <th className="py-2 pr-3">Time</th>
                  <th className="py-2 pr-3">Dir</th>
                  <th className="py-2 pr-3">Amount</th>
                  <th className="py-2 pr-3">Hash</th>
                </tr>
              </thead>
              <tbody>
                {nativeTxs.map((t) => {
                  const isIn = t.to && t.to.toLowerCase() === lowerAddr;
                  const vEth = weiToEth(t.value);
                  return (
                    <tr key={t.hash} className="border-b border-gray-900">
                      <td className="py-2 pr-3">
                        {new Date(Number(t.timeStamp) * 1000).toLocaleString()}
                      </td>
                      <td className="py-2 pr-3">{isIn ? "IN" : "OUT"}</td>
                      <td className="py-2 pr-3">{fmt(vEth)} ETH</td>
                      <td className="py-2 pr-3">
                        <a
                          className="underline"
                          href={`https://base.blockscout.com/tx/${t.hash}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t.hash.slice(0, 10)}…
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

      {tokenStats && tokenStats.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">Token Transfers (ERC-20)</h2>
          <div className="mt-2 overflow-x-auto rounded-xl border border-gray-800">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-800 bg-gray-950">
                  <th className="py-2 pr-3">Token</th>
                  <th className="py-2 pr-3">In</th>
                  <th className="py-2 pr-3">Out</th>
                  <th className="py-2 pr-3">Total</th>
                  <th className="py-2 pr-3">Transfers</th>
                  <th className="py-2 pr-3">Contract</th>
                </tr>
              </thead>
              <tbody>
                {tokenStats.map((row) => (
                  <tr key={row.contract} className="border-b border-gray-900">
                    <td className="py-2 pr-3 font-medium">
                      {row.symbol} <span className="text-xs text-gray-400">({row.name})</span>
                    </td>
                    <td className="py-2 pr-3">{fmt(row.in)}</td>
                    <td className="py-2 pr-3">{fmt(row.out)}</td>
                    <td className="py-2 pr-3">{fmt(row.total)}</td>
                    <td className="py-2 pr-3">{row.count}</td>
                    <td className="py-2 pr-3">
                      <a
                        className="underline"
                        href={`https://base.blockscout.com/address/${row.contract}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {row.contract.slice(0, 10)}…
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {!loading && !error && !nativeStats && (
        <p className="mt-8 text-sm text-gray-300">
          Enter an address and click <b>Check</b> to see recent activity.
        </p>
      )}
    </section>
  );
}
