"use client"

import { WagmiProvider, createConfig, http } from "wagmi"
import type { Chain } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"

// Create a query client
const queryClient = new QueryClient()

// Define Unichain Sepolia Testnet
const unichainSepolia: Chain = {
  id: 1301,
  name: "Unichain Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia.unichain.org"],
    },
    public: {
      http: ["https://sepolia.unichain.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://unichain-sepolia.blockscout.com",
    },
  },
  testnet: true,
}

// Create wagmi config with only Unichain Sepolia
const config = createConfig({
  chains: [unichainSepolia],
  transports: {
    [unichainSepolia.id]: http(),
  },
})

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

