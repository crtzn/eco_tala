"use client";

import { useConnect, useDisconnect, useAccount } from "wagmi";
import { Button } from "./EcoTalaComponents";
import { useNotification } from "./NotificationSystem";

export function WalletConnection() {
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();
  const addNotification = useNotification();

  const handleConnect = async (connector: (typeof connectors)[0]) => {
    try {
      await connect({ connector });
      addNotification({
        title: "Success",
        body: "Wallet connected successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Connection error:", error);
      addNotification({
        title: "Error",
        body: "Failed to connect wallet. Please try again.",
        type: "error",
      });
    }
  };

  if (isConnected) {
    return (
      <div className="flex items-center space-x-3">
        <div className="text-sm">
          <div className="text-[var(--app-foreground)] font-medium">
            Connected
          </div>
          <div className="text-[var(--app-foreground-muted)] font-mono text-xs">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <button
          className="w-full bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-[var(--app-background)] py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
          onClick={() => {
            // Connect with Coinbase Wallet (smart wallet)
            const coinbaseConnector = connectors.find((c) =>
              c.name.includes("Coinbase"),
            );
            if (coinbaseConnector) {
              handleConnect(coinbaseConnector);
            } else if (connectors[0]) {
              handleConnect(connectors[0]);
            }
          }}
          disabled={isPending}
        >
          {isPending ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Connecting...</span>
            </div>
          ) : (
            "Connect Wallet"
          )}
        </button>
      </div>
    </div>
  );
}
