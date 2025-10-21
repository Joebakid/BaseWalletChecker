// components/DappBadge.tsx
"use client";

import React, { useEffect, useState } from "react";
import { getContractLabel, shortAddr } from "@/lib/contractMeta";
import { BASE_BLOCKSCOUT } from "@/lib/api";

type Props = {
  address?: string | null;
  className?: string;
};

export default function DappBadge({ address, className }: Props) {
  const [label, setLabel] = useState<string | undefined>(undefined);

  useEffect(() => {
    let on = true;
    (async () => {
      const l = await getContractLabel(address);
      if (on) setLabel(l);
    })();
    return () => {
      on = false;
    };
  }, [address]);

  if (!address) return null;

  const href = `${BASE_BLOCKSCOUT}/address/${address}`;
  const text = label ?? "Unknown";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 rounded-lg border px-2 py-1 text-xs hover:opacity-90 ${label ? "border-emerald-700 bg-emerald-900/30 text-emerald-200" : "border-gray-700 bg-gray-800/40 text-gray-300"} ${className ?? ""}`}
      title={address}
    >
      <span className="font-medium">{text}</span>
      <span className="opacity-80">{shortAddr(address)}</span>
    </a>
  );
}
