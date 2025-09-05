"use client";

import { useCallback } from "react";
import { useAccount } from "wagmi";
import {
  Transaction,
  TransactionButton,
  TransactionToast,
  TransactionToastAction,
  TransactionToastIcon,
  TransactionToastLabel,
  TransactionError,
  TransactionResponse,
  TransactionStatusAction,
  TransactionStatusLabel,
  TransactionStatus,
} from "@coinbase/onchainkit/transaction";
import { useNotification } from "./NotificationSystem";
import { contractCalls } from "../../lib/contract-utils";

export function TestTransaction() {
  const { address } = useAccount();
  const sendNotification = useNotification();

  // Simple test transaction to log an eco action
  const testCalls = address
    ? [contractCalls.logAction("Recycle Plastic", "test_photo_hash_123")]
    : [];

  const handleSuccess = useCallback(
    async (response: TransactionResponse) => {
      const transactionHash = response.transactionReceipts[0].transactionHash;

      console.log(`🎉 EcoTala Test Transaction successful: ${transactionHash}`);

      await sendNotification({
        title: "🌱 EcoTala Test Success!",
        body: `Gasless transaction worked! Hash: ${transactionHash.slice(0, 10)}...`,
      });
    },
    [sendNotification],
  );

  const handleError = useCallback((error: TransactionError) => {
    console.error("❌ EcoTala Test Transaction failed:", error);
  }, []);

  if (!address) {
    return (
      <div className="bg-[var(--app-card-bg)] rounded-lg p-4 border border-[var(--app-card-border)]">
        <p className="text-[var(--app-foreground-muted)] text-sm text-center">
          Connect wallet to test gasless transactions
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--app-card-bg)] rounded-lg p-4 border border-[var(--app-card-border)]">
      <h3 className="text-lg font-medium text-[var(--app-foreground)] mb-3">
        🧪 Test Gasless Transaction
      </h3>

      <p className="text-[var(--app-foreground-muted)] text-sm mb-4">
        Test if gasless transactions work with your EcoTala smart contract. This
        will call{" "}
        <code>
          logAction(&quot;Recycle Plastic&quot;,
          &quot;test_photo_hash_123&quot;)
        </code>
      </p>

      <Transaction
        calls={testCalls}
        onSuccess={handleSuccess}
        onError={handleError}
      >
        <TransactionButton
          text="🚀 Test EcoTala Gasless Transaction"
          className="w-full bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-white font-medium py-3 px-4 rounded-lg transition-colors"
        />

        <TransactionStatus>
          <TransactionStatusAction />
          <TransactionStatusLabel />
        </TransactionStatus>

        <TransactionToast className="mb-4">
          <TransactionToastIcon />
          <TransactionToastLabel />
          <TransactionToastAction />
        </TransactionToast>
      </Transaction>

      <div className="mt-4 text-xs text-[var(--app-foreground-muted)]">
        <p>✅ Contract: {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}</p>
        <p>
          ✅ Network: Base Sepolia Testnet (Chain{" "}
          {process.env.NEXT_PUBLIC_CHAIN_ID})
        </p>
        <p>✅ Paymaster: Enabled for gasless transactions</p>
        <p>💡 Make sure your wallet is connected to Base Sepolia network!</p>
      </div>
    </div>
  );
}
