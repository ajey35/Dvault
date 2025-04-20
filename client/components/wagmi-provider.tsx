"use client"

import type React from "react"

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider as WagmiProviderBase } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { useState, useEffect } from "react"

// Use a valid public project ID for WalletConnect
// In a production app, you should get your own project ID from https://cloud.walletconnect.com
const DEMO_PROJECT_ID = "5b90d771ac45e1d35323bf01b48b3708"

const config = getDefaultConfig({
  appName: "PassVault",
  projectId: DEMO_PROJECT_ID,
  chains: [mainnet, sepolia],
  // Add this to avoid unnecessary network requests
  ssr: true,
})

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <WagmiProviderBase config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{mounted && children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProviderBase>
  )
}
