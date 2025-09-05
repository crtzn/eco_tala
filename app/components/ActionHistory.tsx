"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Button, Icon } from "./EcoTalaComponents";
import { useEcoTalaContract } from "../../hooks/useEcoTalaContract";
import { getActionIcon } from "../../lib/contract-utils";
import { getIPFSUrl } from "../../lib/photo-utils";

type ActionHistoryProps = {
  onClose: () => void;
};

type ActionEntry = {
  id: string;
  actionType: string;
  photoHash: string;
  points: number;
  timestamp: Date;
  verified: boolean;
  transactionHash?: string;
};

export function ActionHistory({ onClose }: ActionHistoryProps) {
  const { address } = useAccount();
  const { userStats, loading } = useEcoTalaContract();
  const [selectedAction, setSelectedAction] = useState<ActionEntry | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock action history for demo (in production, fetch from contract)
  const [actionHistory, setActionHistory] = useState<ActionEntry[]>([]);

  useEffect(() => {
    if (!userStats?.actionCount) return;

    // Generate mock action history based on user stats
    const mockActions: ActionEntry[] = [];
    const actionTypes = [
      "Recycle Plastic",
      "Reusable Cup",
      "Carpool",
      "Plant Tree",
      "Solar Energy",
    ];

    for (let i = 0; i < Math.min(userStats.actionCount, 20); i++) {
      const actionType = actionTypes[i % actionTypes.length];
      mockActions.push({
        id: `action_${i}`,
        actionType,
        photoHash: `demo_photo_${i}_${Date.now()}`,
        points: 10 + (i % 3) * 5, // Varying points
        timestamp: new Date(Date.now() - i * 86400000), // i days ago
        verified: true,
        transactionHash: `0x${Math.random().toString(16).slice(2, 66)}`,
      });
    }

    setActionHistory(mockActions);
  }, [userStats]);

  if (!address) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[var(--app-card-bg)] rounded-xl shadow-lg border border-[var(--app-card-border)] w-full max-w-md p-6">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-[var(--app-foreground)]">
              Connect Wallet
            </h2>
            <p className="text-[var(--app-foreground-muted)]">
              Please connect your wallet to view action history
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--app-card-bg)] rounded-xl shadow-2xl border border-[var(--app-card-border)] w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--app-card-border)]">
          <h2 className="text-xl font-bold text-[var(--app-foreground)]">
            📋 Action History
          </h2>
          <div className="flex items-center space-x-2">
            <div className="flex border border-[var(--app-card-border)] rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 text-sm rounded-l-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-[var(--app-accent)] text-[var(--app-background)]"
                    : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1 text-sm rounded-r-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-[var(--app-accent)] text-[var(--app-background)]"
                    : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
                }`}
              >
                List
              </button>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="p-6 border-b border-[var(--app-card-border)] bg-[var(--app-accent-light)]">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[var(--app-accent)]">
                {userStats?.actionCount || 0}
              </div>
              <div className="text-sm text-[var(--app-foreground-muted)]">
                Total Actions
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--app-accent)]">
                {userStats?.points || 0}
              </div>
              <div className="text-sm text-[var(--app-foreground-muted)]">
                Points Earned
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--app-accent)]">
                {actionHistory.filter((a) => a.verified).length}
              </div>
              <div className="text-sm text-[var(--app-foreground-muted)]">
                Verified
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--app-accent)]">
                {actionHistory.length > 0
                  ? Math.ceil(actionHistory.length / 30)
                  : 0}
              </div>
              <div className="text-sm text-[var(--app-foreground-muted)]">
                This Month
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--app-accent)]"></div>
              <p className="text-sm text-[var(--app-foreground-muted)] mt-2">
                Loading action history...
              </p>
            </div>
          ) : actionHistory.length === 0 ? (
            <div className="text-center py-8">
              <Icon
                name="camera"
                size="lg"
                className="text-[var(--app-foreground-muted)] mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-[var(--app-foreground)] mb-2">
                No Actions Yet
              </h3>
              <p className="text-[var(--app-foreground-muted)] mb-4">
                Start logging your eco-friendly actions to build your history!
              </p>
              <Button onClick={onClose}>Close</Button>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {actionHistory.map((action) => (
                    <div
                      key={action.id}
                      onClick={() => setSelectedAction(action)}
                      className="cursor-pointer group"
                    >
                      <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg overflow-hidden hover:shadow-lg transition-all">
                        {/* Photo Preview */}
                        <div className="aspect-square bg-[var(--app-gray)] relative overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getIPFSUrl(action.photoHash)}
                            alt={`${action.actionType} proof`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {action.verified && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                              <Icon name="check" size="sm" />
                            </div>
                          )}
                        </div>

                        {/* Action Info */}
                        <div className="p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">
                              {getActionIcon(action.actionType)}
                            </span>
                            <div className="flex-1">
                              <div className="font-medium text-[var(--app-foreground)] text-sm">
                                {action.actionType}
                              </div>
                              <div className="text-xs text-[var(--app-foreground-muted)]">
                                {action.timestamp.toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-[var(--app-accent)]">
                                +{action.points}
                              </div>
                              <div className="text-xs text-[var(--app-foreground-muted)]">
                                points
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {actionHistory.map((action) => (
                    <div
                      key={action.id}
                      onClick={() => setSelectedAction(action)}
                      className="flex items-center space-x-4 p-4 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg hover:shadow-lg transition-all cursor-pointer"
                    >
                      {/* Photo Thumbnail */}
                      <div className="w-16 h-16 bg-[var(--app-gray)] rounded-lg overflow-hidden flex-shrink-0 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getIPFSUrl(action.photoHash)}
                          alt={`${action.actionType} proof`}
                          className="w-full h-full object-cover"
                        />
                        {action.verified && (
                          <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                            <Icon name="check" size="sm" />
                          </div>
                        )}
                      </div>

                      {/* Action Details */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-lg">
                            {getActionIcon(action.actionType)}
                          </span>
                          <div className="font-medium text-[var(--app-foreground)]">
                            {action.actionType}
                          </div>
                        </div>
                        <div className="text-sm text-[var(--app-foreground-muted)]">
                          {action.timestamp.toLocaleDateString()} • +
                          {action.points} points
                        </div>
                        {action.transactionHash && (
                          <div className="text-xs text-[var(--app-foreground-muted)] mt-1">
                            TX: {action.transactionHash.slice(0, 10)}...
                          </div>
                        )}
                      </div>

                      <Icon
                        name="arrow-right"
                        size="sm"
                        className="text-[var(--app-foreground-muted)]"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Action Detail Modal */}
      {selectedAction && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-[var(--app-card-bg)] rounded-xl shadow-2xl border border-[var(--app-card-border)] w-full max-w-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--app-card-border)]">
              <h3 className="text-lg font-bold text-[var(--app-foreground)]">
                Action Details
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedAction(null)}
              >
                ✕
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Full Photo */}
              <div className="aspect-square bg-[var(--app-gray)] rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getIPFSUrl(selectedAction.photoHash)}
                  alt={`${selectedAction.actionType} proof`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Action Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {getActionIcon(selectedAction.actionType)}
                    </span>
                    <div>
                      <div className="font-medium text-[var(--app-foreground)]">
                        {selectedAction.actionType}
                      </div>
                      <div className="text-sm text-[var(--app-foreground-muted)]">
                        {selectedAction.timestamp.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[var(--app-accent)]">
                      +{selectedAction.points}
                    </div>
                    <div className="text-sm text-[var(--app-foreground-muted)]">
                      points
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {selectedAction.verified ? (
                    <>
                      <Icon name="check" size="sm" className="text-green-500" />
                      <span className="text-sm text-green-600">
                        Verified on blockchain
                      </span>
                    </>
                  ) : (
                    <>
                      <Icon name="plus" size="sm" className="text-yellow-500" />
                      <span className="text-sm text-yellow-600">
                        Pending verification
                      </span>
                    </>
                  )}
                </div>

                {selectedAction.transactionHash && (
                  <div className="p-3 bg-[var(--app-accent-light)] rounded-lg">
                    <div className="text-sm font-medium text-[var(--app-foreground)] mb-1">
                      Transaction Hash
                    </div>
                    <div className="text-xs text-[var(--app-foreground-muted)] font-mono break-all">
                      {selectedAction.transactionHash}
                    </div>
                  </div>
                )}

                <div className="p-3 bg-[var(--app-accent-light)] rounded-lg">
                  <div className="text-sm font-medium text-[var(--app-foreground)] mb-1">
                    Photo Hash (IPFS)
                  </div>
                  <div className="text-xs text-[var(--app-foreground-muted)] font-mono break-all">
                    {selectedAction.photoHash}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
