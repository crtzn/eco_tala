"use client";

import { useAccount, useChainId } from "wagmi";

export function NetworkStatus() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  if (!isConnected || !address) {
    return null;
  }

  const isCorrectNetwork = chainId === 84532; // Base Sepolia

  const getNetworkName = (id: number) => {
    switch (id) {
      case 84532:
        return "Base Sepolia";
      case 8453:
        return "Base Mainnet";
      case 1:
        return "Ethereum Mainnet";
      case 11155111:
        return "Sepolia";
      default:
        return `Unknown (${id})`;
    }
  };

  return (
    <div
      className={`p-3 rounded-lg border text-sm ${
        isCorrectNetwork
          ? "bg-green-50 border-green-200 text-green-800"
          : "bg-red-50 border-red-200 text-red-800"
      }`}
    >
      <div className="flex items-center space-x-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isCorrectNetwork ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="font-medium">
          {isCorrectNetwork ? "✅ Correct Network" : "❌ Wrong Network"}
        </span>
      </div>
      <p className="mt-1 text-xs">
        Current: <strong>{getNetworkName(chainId)}</strong>
        {!isCorrectNetwork && (
          <span className="block mt-1">
            Please switch to <strong>Base Sepolia</strong> to use EcoTala
          </span>
        )}
      </p>
    </div>
  );
}
