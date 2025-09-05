"use client";

import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { Button } from "./components/EcoTalaComponents";
import { Icon } from "./components/EcoTalaComponents";
import { Home } from "./components/EcoTalaComponents";
import { Features } from "./components/EcoTalaComponents";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const { isConnected } = useAccount();

  const handleExternalLink = useCallback(() => {
    window.open("https://base.org/builders/minikit", "_blank");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <div className="w-full max-w-md mx-auto px-6 py-4">
        <header className="flex justify-between items-center mb-6 h-12">
          <div>
            <div className="flex items-center space-x-3">
              {isConnected ? (
                <Wallet className="z-10">
                  <ConnectWallet>
                    <Name className="text-inherit font-medium" />
                  </ConnectWallet>
                  <WalletDropdown>
                    <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                      <Avatar />
                      <Name />
                      <Address />
                      <EthBalance />
                    </Identity>
                    <WalletDropdownDisconnect />
                  </WalletDropdown>
                </Wallet>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                    <Icon
                      name="leaf"
                      size="md"
                      className="text-emerald-600 dark:text-emerald-400"
                    />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                      EcoTala
                    </h1>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Green Philippines 🇵🇭
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 rounded-full px-4"
              icon={<Icon name="heart" size="sm" />}
            >
              {isConnected ? "Connected" : "Web App"}
            </Button>
          </div>
        </header>

        <main className="flex-1 pb-6">
          {activeTab === "home" && <Home setActiveTab={setActiveTab} />}
          {activeTab === "features" && <Features setActiveTab={setActiveTab} />}
        </main>

        <footer className="pt-6 flex flex-col items-center space-y-2 border-t border-slate-200/50 dark:border-slate-700/50">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-500 dark:text-slate-400 text-xs hover:text-emerald-600 dark:hover:text-emerald-400"
            onClick={handleExternalLink}
          >
            Built on Base Blockchain 🌿
          </Button>

          <button
            onClick={() => window.open("https://x.com/cortezano_dev", "_blank")}
            className="text-xs text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
          >
            Created by @cortezano
          </button>
        </footer>
      </div>
    </div>
  );
}
