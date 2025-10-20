// components/BaseDappTxs.tsx
"use client";

import { useState } from "react";

type Row = {
  hash: string;
  to: string;
  dappKey: string;
  dapp: string;
  timeStamp: number;
  dateUTC: string;
  valueEth: number;
  isError: boolean;
  functionName: string;
  methodId: string;
};

type ApiResponse = {
  address: string;
  days: number | null;
  totalMatched: number;
  summaryByDapp: Record<string, number>;
  txs: Row[];
  apiMessage?: string;
};

const BASE_TX_URLS = {
  blockscout: (hash: string) => `https://base.blockscout.com/tx/${hash}`,
  basescan: (hash: string) => `https://basescan.org/tx/${hash}`,
};

export default function BaseDappTxs() {
  const [addr, setAddr] = useState("");
  const [days, setDays] = useState<number>(90);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTxs = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch("/api/dapp-txs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: addr, days }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch");
      setData(json);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  const canFetch = addr.trim().length > 0 && !loading;

  return (
    <div className="mx-auto max-w-5xl p-4 text-sm text-gray-200">
      <h1 className="text-2xl font-bold mb-4">Base dApp Transactions</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
        <label className="block text-xs uppercase text-gray-400 mb-2">
          Wallet Address (0x…)
        </label>
        <input
          className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 outline-none"
          placeholder="Enter 0x wallet address"
          value={addr}
          onChange={(e) => setAddr(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canFetch) fetchTxs();
          }}
        />

        <div className="mt-4 flex items-center gap-3">
          <label className="text-xs uppercase text-gray-400">
            Look back (days)
          </label>
          <input
            type="number"
            min={1}
            className="w-28 rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 outline-none"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          />
          <button
            onClick={fetchTxs}
            disabled={!canFetch}
            className="ml-auto rounded-lg bg-white text-black px-4 py-2 disabled:opacity-60"
          >
            {loading ? "Checking…" : "Fetch"}
          </button>
        </div>

        {data?.apiMessage && (
          <div className="mt-3 text-xs text-gray-500">API: {data.apiMessage}</div>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-800 bg-red-950 p-3 text-red-200">
          {error}
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <div className="text-gray-400 text-xs uppercase">Address</div>
                <div className="font-mono break-all">{data.address}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs uppercase">Days</div>
                <div>{data.days ?? "—"}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs uppercase">
                  Matched dApp txs
                </div>
                <div className="text-lg font-semibold">{data.totalMatched}</div>
              </div>
            </div>

            {Object.keys(data.summaryByDapp).length > 0 && (
              <div className="mt-4">
                <div className="text-gray-400 text-xs uppercase mb-2">
                  Summary by dApp
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(data.summaryByDapp).map(([dapp, count]) => (
                    <span
                      key={dapp}
                      className="rounded-full border border-gray-700 bg-gray-950 px-3 py-1"
                    >
                      {dapp}: <b>{count}</b>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full text-left text-gray-200">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="px-3 py-2">Date (UTC)</th>
                  <th className="px-3 py-2">dApp</th>
                  <th className="px-3 py-2">To</th>
                  <th className="px-3 py-2">ETH Value</th>
                  <th className="px-3 py-2">Method</th>
                  <th className="px-3 py-2">Tx</th>
                </tr>
              </thead>
              <tbody>
                {data.txs.map((t) => (
                  <tr
                    key={t.hash}
                    className="border-t border-gray-800 hover:bg-gray-900/60"
                  >
                    <td className="px-3 py-2 whitespace-nowrap">{t.dateUTC}</td>
                    <td className="px-3 py-2">{t.dapp}</td>
                    <td className="px-3 py-2 font-mono">{t.to}</td>
                    <td className="px-3 py-2">
                      {t.valueEth === 0 ? "0" : t.valueEth.toFixed(6)}
                    </td>
                    <td className="px-3 py-2">
                      {t.functionName || t.methodId || "—"}
                    </td>
                    <td className="px-3 py-2">
                      <a
                        className="underline"
                        href={BASE_TX_URLS.blockscout(t.hash)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                      <span className="mx-2 text-gray-600">/</span>
                      <a
                        className="underline"
                        href={BASE_TX_URLS.basescan(t.hash)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        BaseScan
                      </a>
                    </td>
                  </tr>
                ))}
                {data.txs.length === 0 && (
                  <tr>
                    <td className="px-3 py-6 text-center text-gray-400" colSpan={6}>
                      No matching dApp transactions in the selected window.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
