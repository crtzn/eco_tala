"use client";

import { useCallback } from "react";
import { Button } from "./EcoTalaComponents";

export function NetworkHelper() {
  const addBaseSepoliaToWallet = useCallback(async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x14A34", // 84532 in hex
              chainName: "Base Sepolia",
              nativeCurrency: {
                name: "Ethereum",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["https://sepolia.base.org"],
              blockExplorerUrls: ["https://sepolia.basescan.org"],
            },
          ],
        });

        console.log("✅ Base Sepolia network added to wallet");
      } catch (error) {
        console.error("❌ Failed to add Base Sepolia network:", error);
      }
    } else {
      console.log("MetaMask not detected");
    }
  }, []);

  const switchToBaseSepolia = useCallback(async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x14A34" }], // 84532 in hex
        });

        console.log("✅ Switched to Base Sepolia network");
      } catch (error: unknown) {
        // If the network hasn't been added to the user's wallet, add it
        if (
          error &&
          typeof error === "object" &&
          "code" in error &&
          error.code === 4902
        ) {
          await addBaseSepoliaToWallet();
        } else {
          console.error("❌ Failed to switch to Base Sepolia network:", error);
        }
      }
    }
  }, [addBaseSepoliaToWallet]);

  return (
    <div className="bg-[var(--app-card-bg)] rounded-lg p-4 border border-[var(--app-card-border)]">
      <h3 className="text-lg font-medium text-[var(--app-foreground)] mb-3">
        🌐 Network Setup Helper
      </h3>

      <p className="text-[var(--app-foreground-muted)] text-sm mb-4">
        For EcoTala to work properly, you need to connect to{" "}
        <strong>Base Sepolia testnet</strong>. Click the button below to
        add/switch to the correct network.
      </p>

      <div className="space-y-3">
        <Button
          variant="primary"
          onClick={switchToBaseSepolia}
          className="w-full"
        >
          🔄 Switch to Base Sepolia Network
        </Button>

        <Button
          variant="outline"
          onClick={addBaseSepoliaToWallet}
          className="w-full"
        >
          ➕ Add Base Sepolia to Wallet
        </Button>
      </div>

      <div className="mt-4 text-xs text-[var(--app-foreground-muted)] space-y-1">
        <p>
          <strong>Network Details:</strong>
        </p>
        <p>• Name: Base Sepolia</p>
        <p>• Chain ID: 84532 (0x14A34)</p>
        <p>• RPC: https://sepolia.base.org</p>
        <p>• Explorer: https://sepolia.basescan.org</p>
      </div>
    </div>
  );
}
