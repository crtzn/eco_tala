"use client";

import { type ReactNode } from "react";
import { baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig } from "wagmi";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { coinbaseWallet } from "wagmi/connectors";
import { http } from "viem";
import { NotificationProvider } from "./components/NotificationSystem";
import { createStorage } from "wagmi";

// Create query client for React Query
const queryClient = new QueryClient();

// Create wagmi config with proper connectors and persistence
const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "EcoTala",
      appLogoUrl: process.env.NEXT_PUBLIC_ICON_URL,
      preference: "smartWalletOnly", // Use smart wallet for gasless transactions
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
  ssr: false, // Important for proper hydration
  storage: createStorage({
    storage: typeof window !== "undefined" ? localStorage : undefined,
  }),
});

export function Providers(props: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={baseSepolia}
          config={{
            appearance: {
              mode: "auto",
              theme: "base",
              name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
              logo: process.env.NEXT_PUBLIC_ICON_URL,
            },
            wallet: {
              display: "modal", // Show wallet connection modal
            },
          }}
        >
          <NotificationProvider>{props.children}</NotificationProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
