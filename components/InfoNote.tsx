// components/InfoNote.tsx
"use client";
import { useState } from "react";
import { FiInfo } from "react-icons/fi";

export default function InfoNote() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-400 hover:text-gray-200"
        aria-label="Info"
      >
        <FiInfo className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-80 rounded-lg border border-gray-700 bg-black p-3 text-xs text-gray-300 shadow-lg">
          <p className="mb-1">
            <b>Dir:</b> Direction of transfer (<span className="text-emerald-400">IN</span> = received, <span className="text-rose-400">OUT</span> = sent).
          </p>
          <p className="mb-1">
            <b>Amount:</b> Value of the transfer (in ETH).
          </p>
          <p className="mb-1">
            <b>Incoming:</b> ETH or tokens received by this wallet.
          </p>
          <p className="mb-1">
            <b>Outgoing:</b> ETH or tokens sent from this wallet.
          </p>
          <p className="mb-1">
            <b>Total moved:</b> Incoming + Outgoing volume.
          </p>
          <p className="mb-1">
            <b>Days active:</b> Days when this wallet made or received transactions.
          </p>
          <p className="mb-1">
            <b>Native tx count:</b> Number of ETH (native) transfers.
          </p>
          <p className="mb-1">
            <b>Unique peers:</b> Distinct addresses interacted with.
          </p>
          <p className="mb-1">
            <b>Native Transfers (ETH on Base):</b> All ETH in/out history.
          </p>
          <p className="mb-1">
            <b>Token Transfers (ERC-20):</b> Token movements (in/out).
          </p>
          <p className="mb-1">
            <b>Est. airdrop %:</b> Score based on stricter criteria:
          </p>
          <ul className="list-disc list-inside ml-3 space-y-1">
            <li>≥ 100 total transactions</li>
            <li>Active for ≥ 60 days</li>
            <li>≥ 20 unique peers</li>
            <li>≥ 5 ETH total moved</li>
            <li>≥ 10 token transfers</li>
            <li>≥ 0.1 ETH balance held</li>
          </ul>
          <button
            onClick={() => setOpen(false)}
            className="mt-3 rounded bg-gray-800 px-2 py-1 text-xs hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
