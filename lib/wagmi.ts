// lib/wagmi.ts
"use client";

import { createConfig, http } from "wagmi";
import { cookieStorage, createStorage } from "wagmi";
import { base } from "viem/chains";

export const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(), // uses public RPC; swap for your RPC if you have one
  },
  storage: createStorage({
    storage: cookieStorage, // SSR-friendly persistence
  }),
  ssr: true,
});
