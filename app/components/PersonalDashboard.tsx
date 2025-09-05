"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useEcoTalaContract } from "../../hooks/useEcoTalaContract";
import { Button, Icon } from "./EcoTalaComponents";

type PersonalDashboardProps = {
  onClose: () => void;
  onShare?: () => void;
};

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earned: boolean;
  earnedDate?: string;
};

type EcoAction = {
  id: string;
  type: string;
  description: string;
  points: number;
  timestamp: string;
  photoUrl?: string;
  verified: boolean;
};

export function PersonalDashboard({
  onClose,
  onShare,
}: PersonalDashboardProps) {
  const { address } = useAccount();
  const { userStats } = useEcoTalaContract();
  const [activeTab, setActiveTab] = useState<"overview" | "actions" | "badges">(
    "overview",
  );
  const [actions, setActions] = useState<EcoAction[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulate loading user data
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);

      // Simulate API calls - replace with real data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user actions
      const mockActions: EcoAction[] = [
        {
          id: "1",
          type: "Waste Segregation",
          description: "Properly separated plastic bottles for recycling",
          points: 10,
          timestamp: "2025-09-05T10:30:00Z",
          photoUrl: "/api/placeholder-photo",
          verified: true,
        },
        {
          id: "2",
          type: "Tree Planting",
          description: "Planted 3 native trees in Quezon City",
          points: 25,
          timestamp: "2025-09-04T14:15:00Z",
          photoUrl: "/api/placeholder-photo",
          verified: true,
        },
        {
          id: "3",
          type: "Clean Drive",
          description: "Collected 5kg of trash from Manila Bay",
          points: 15,
          timestamp: "2025-09-03T08:45:00Z",
          photoUrl: "/api/placeholder-photo",
          verified: true,
        },
      ];

      // Mock badges
      const mockBadges: Badge[] = [
        {
          id: "eco-starter",
          name: "Eco Starter",
          description: "Completed your first environmental action",
          icon: "🌱",
          rarity: "common",
          earned: true,
          earnedDate: "2025-09-03",
        },
        {
          id: "waste-warrior",
          name: "Waste Warrior",
          description: "Properly disposed 10kg of waste",
          icon: "♻️",
          rarity: "rare",
          earned: true,
          earnedDate: "2025-09-04",
        },
        {
          id: "tree-guardian",
          name: "Tree Guardian",
          description: "Plant 5 or more trees",
          icon: "🌳",
          rarity: "epic",
          earned: false,
        },
        {
          id: "climate-hero",
          name: "Climate Hero",
          description: "Complete 100 environmental actions",
          icon: "🏆",
          rarity: "legendary",
          earned: false,
        },
      ];

      setActions(mockActions);
      setBadges(mockBadges);
      setLoading(false);
    };

    loadUserData();
  }, [address]);

  const totalPoints =
    userStats?.points ||
    actions.reduce((sum, action) => sum + action.points, 0);
  const totalActions = userStats?.actionCount || actions.length;
  const earnedBadges = badges.filter((badge) => badge.earned);
  const completionRate = (totalActions / 100) * 100; // Percentage towards Climate Hero

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "text-gray-500";
      case "rare":
        return "text-blue-500";
      case "epic":
        return "text-purple-500";
      case "legendary":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[var(--app-background)] rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--app-accent)]"></div>
            <span className="text-[var(--app-foreground)]">
              Loading your eco journey...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--app-background)] rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[var(--app-foreground)] flex items-center">
            <Icon name="users" className="mr-3 text-[var(--app-accent)]" />
            Personal Dashboard
          </h2>
          <div className="flex items-center space-x-2">
            {onShare && (
              <Button variant="outline" size="sm" onClick={onShare}>
                <Icon name="heart" size="sm" className="mr-1" />
                Share
              </Button>
            )}
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)]">
            <div className="text-3xl font-bold text-[var(--app-accent)]">
              {totalPoints}
            </div>
            <div className="text-sm text-[var(--app-foreground-muted)]">
              Total Points
            </div>
          </div>
          <div className="text-center p-4 bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)]">
            <div className="text-3xl font-bold text-[var(--app-accent)]">
              {totalActions}
            </div>
            <div className="text-sm text-[var(--app-foreground-muted)]">
              Actions Logged
            </div>
          </div>
          <div className="text-center p-4 bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)]">
            <div className="text-3xl font-bold text-[var(--app-accent)]">
              {earnedBadges.length}
            </div>
            <div className="text-sm text-[var(--app-foreground-muted)]">
              Badges Earned
            </div>
          </div>
          <div className="text-center p-4 bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)]">
            <div className="text-3xl font-bold text-[var(--app-accent)]">
              {Math.round(completionRate)}%
            </div>
            <div className="text-sm text-[var(--app-foreground-muted)]">
              Climate Hero
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-4 bg-[var(--app-card-bg)] p-1 rounded-lg">
          {[
            {
              id: "overview" as const,
              label: "Overview",
              icon: "star" as const,
            },
            {
              id: "actions" as const,
              label: "Actions",
              icon: "camera" as const,
            },
            { id: "badges" as const, label: "Badges", icon: "trophy" as const },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[var(--app-accent)] text-[var(--app-background)]"
                  : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
              }`}
            >
              <Icon name={tab.icon} size="sm" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Recent Actions */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[var(--app-foreground)]">
                  Recent Actions
                </h3>
                <div className="space-y-3">
                  {actions.slice(0, 3).map((action) => (
                    <div
                      key={action.id}
                      className="flex items-center space-x-4 p-3 bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)]"
                    >
                      <div className="w-12 h-12 bg-[var(--app-accent-light)] rounded-lg flex items-center justify-center">
                        {action.photoUrl ? (
                          <div className="w-10 h-10 bg-gray-300 rounded-md"></div>
                        ) : (
                          <Icon
                            name="camera"
                            className="text-[var(--app-accent)]"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-[var(--app-foreground)]">
                          {action.type}
                        </div>
                        <div className="text-sm text-[var(--app-foreground-muted)]">
                          {action.description}
                        </div>
                        <div className="text-xs text-[var(--app-foreground-muted)]">
                          {formatDate(action.timestamp)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[var(--app-accent)]">
                          +{action.points}
                        </div>
                        <div className="text-xs text-[var(--app-foreground-muted)]">
                          points
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest Badges */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[var(--app-foreground)]">
                  Latest Badges
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {earnedBadges.slice(0, 4).map((badge) => (
                    <div
                      key={badge.id}
                      className="p-3 bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)] text-center"
                    >
                      <div className="text-2xl mb-2">{badge.icon}</div>
                      <div className="font-medium text-[var(--app-foreground)]">
                        {badge.name}
                      </div>
                      <div
                        className={`text-xs ${getRarityColor(badge.rarity)}`}
                      >
                        {badge.rarity.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "actions" && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[var(--app-foreground)]">
                All Actions ({actions.length})
              </h3>
              {actions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center space-x-4 p-4 bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)]"
                >
                  <div className="w-16 h-16 bg-[var(--app-accent-light)] rounded-lg flex items-center justify-center">
                    {action.photoUrl ? (
                      <div className="w-14 h-14 bg-gray-300 rounded-md"></div>
                    ) : (
                      <Icon
                        name="camera"
                        className="text-[var(--app-accent)]"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-[var(--app-foreground)]">
                      {action.type}
                    </div>
                    <div className="text-sm text-[var(--app-foreground-muted)] mb-1">
                      {action.description}
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-[var(--app-foreground-muted)]">
                      <span>{formatDate(action.timestamp)}</span>
                      {action.verified && (
                        <span className="flex items-center space-x-1 text-green-500">
                          <Icon name="check" size="sm" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[var(--app-accent)] text-lg">
                      +{action.points}
                    </div>
                    <div className="text-xs text-[var(--app-foreground-muted)]">
                      points
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "badges" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[var(--app-foreground)]">
                Badge Collection ({earnedBadges.length}/{badges.length})
              </h3>

              {/* Earned Badges */}
              <div>
                <h4 className="text-md font-medium mb-3 text-[var(--app-foreground)]">
                  Earned Badges
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {earnedBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="p-4 bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)]"
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <div className="font-medium text-[var(--app-foreground)]">
                          {badge.name}
                        </div>
                        <div
                          className={`text-sm ${getRarityColor(badge.rarity)} mb-2`}
                        >
                          {badge.rarity.toUpperCase()}
                        </div>
                        <div className="text-xs text-[var(--app-foreground-muted)]">
                          {badge.description}
                        </div>
                        {badge.earnedDate && (
                          <div className="text-xs text-[var(--app-accent)] mt-2">
                            Earned:{" "}
                            {new Date(badge.earnedDate).toLocaleDateString(
                              "en-PH",
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Locked Badges */}
              <div>
                <h4 className="text-md font-medium mb-3 text-[var(--app-foreground)]">
                  Locked Badges
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {badges
                    .filter((badge) => !badge.earned)
                    .map((badge) => (
                      <div
                        key={badge.id}
                        className="p-4 bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)] opacity-60"
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2 grayscale">
                            {badge.icon}
                          </div>
                          <div className="font-medium text-[var(--app-foreground)]">
                            {badge.name}
                          </div>
                          <div
                            className={`text-sm ${getRarityColor(badge.rarity)} mb-2`}
                          >
                            {badge.rarity.toUpperCase()}
                          </div>
                          <div className="text-xs text-[var(--app-foreground-muted)]">
                            {badge.description}
                          </div>
                          <div className="text-xs text-[var(--app-accent)] mt-2">
                            🔒 Locked
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
