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
  const {
    userStats,
    userActions,
    loading: contractLoading,
  } = useEcoTalaContract();
  const [activeTab, setActiveTab] = useState<"overview" | "actions" | "badges">(
    "overview",
  );
  const [actions, setActions] = useState<EcoAction[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user data (combine real blockchain data with demo data when needed)
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);

      // Use real blockchain actions if available, otherwise show demo data
      if (userActions && userActions.length > 0) {
        const realActions: EcoAction[] = userActions.map((action, index) => ({
          id: `real_${index}`,
          type: action.actionType,
          description: `Verified ${action.actionType.toLowerCase()} action`,
          points: action.points,
          timestamp: action.timestamp.toISOString(),
          photoUrl: `/api/placeholder-photo`,
          verified: action.verified,
        }));
        setActions(realActions);
      } else {
        // Show demo data for empty states (perfect for demo!)
        const demoActions: EcoAction[] = [
          {
            id: "demo_1",
            type: "Waste Segregation",
            description: "Properly separated plastic bottles for recycling",
            points: 10,
            timestamp: "2025-09-05T10:30:00Z",
            photoUrl: "/api/placeholder-photo",
            verified: true,
          },
          {
            id: "demo_2",
            type: "Tree Planting",
            description: "Planted 3 native trees in Quezon City",
            points: 25,
            timestamp: "2025-09-04T14:15:00Z",
            photoUrl: "/api/placeholder-photo",
            verified: true,
          },
          {
            id: "demo_3",
            type: "Clean Drive",
            description: "Collected 5kg of trash from Manila Bay",
            points: 15,
            timestamp: "2025-09-03T08:45:00Z",
            photoUrl: "/api/placeholder-photo",
            verified: true,
          },
        ];
        setActions(demoActions);
      }

      // Load badges based on actual user stats when available
      const currentPoints = userStats?.points || 0;
      const currentActions = userStats?.actionCount || 0;

      const dynamicBadges: Badge[] = [
        {
          id: "eco-starter",
          name: "Eco Starter",
          description: "Completed your first environmental action",
          icon: "🌱",
          rarity: "common",
          earned: currentActions > 0,
          earnedDate: currentActions > 0 ? "2025-09-03" : undefined,
        },
        {
          id: "waste-warrior",
          name: "Waste Warrior",
          description: "Earned 50+ environmental points",
          icon: "♻️",
          rarity: "rare",
          earned: currentPoints >= 50,
          earnedDate: currentPoints >= 50 ? "2025-09-04" : undefined,
        },
        {
          id: "tree-guardian",
          name: "Tree Guardian",
          description: "Reached 100+ environmental points",
          icon: "🌳",
          rarity: "epic",
          earned: currentPoints >= 100,
          earnedDate: currentPoints >= 100 ? "2025-09-02" : undefined,
        },
        {
          id: "climate-hero",
          name: "Climate Hero",
          description: "Achieved 500+ environmental points",
          icon: "🏆",
          rarity: "legendary",
          earned: currentPoints >= 500,
          earnedDate: currentPoints >= 500 ? "2025-09-01" : undefined,
        },
      ];

      setBadges(dynamicBadges);
      setLoading(false);
    };

    loadUserData();
  }, [address, userStats, userActions]);

  // Calculate stats prioritizing real data
  const totalPoints =
    userStats?.points !== undefined
      ? userStats.points
      : actions.reduce((sum, action) => sum + action.points, 0);
  const totalActions =
    userStats?.actionCount !== undefined
      ? userStats.actionCount
      : actions.length;
  const earnedBadges = badges.filter((badge) => badge.earned);
  const completionRate = Math.min((totalActions / 100) * 100, 100); // Percentage towards Climate Hero

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

  const getCurrentRank = () => {
    if (totalPoints >= 500) return "Climate Hero";
    if (totalPoints >= 100) return "Tree Guardian";
    if (totalPoints >= 50) return "Waste Warrior";
    if (totalPoints >= 10) return "Eco Starter";
    return "Eco Beginner";
  };

  if (!address) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="text-center py-8">
            <Icon
              name="users"
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
            />
            <h3 className="text-xl font-semibold mb-2">
              Connect Wallet Required
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please connect your wallet to view your personal dashboard.
            </p>
            <Button onClick={onClose} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Icon name="users" className="w-8 h-8 text-emerald-500" />
            <h2 className="text-2xl font-bold">Personal Dashboard</h2>
          </div>
          <div className="flex items-center gap-3">
            {onShare && (
              <Button onClick={onShare} variant="outline" size="sm">
                <Icon name="arrow-right" className="w-4 h-4 mr-2" />
                Share
              </Button>
            )}
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <Icon name="plus" className="w-5 h-5 rotate-45" />
            </Button>
          </div>
        </div>

        {loading || contractLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading your eco journey...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {totalPoints}
                </div>
                <div className="text-sm text-emerald-600/80 dark:text-emerald-400/80">
                  Total Points
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {totalActions}
                </div>
                <div className="text-sm text-blue-600/80 dark:text-blue-400/80">
                  Actions Logged
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {earnedBadges.length}
                </div>
                <div className="text-sm text-purple-600/80 dark:text-purple-400/80">
                  Badges Earned
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {Math.round(completionRate)}%
                </div>
                <div className="text-sm text-amber-600/80 dark:text-amber-400/80">
                  {getCurrentRank()}
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
              {(
                [
                  { id: "overview", label: "Overview", icon: "star" },
                  { id: "actions", label: "Actions", icon: "leaf" },
                  { id: "badges", label: "Badges", icon: "trophy" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
                    activeTab === tab.id
                      ? "bg-white dark:bg-slate-600 shadow-sm text-emerald-600 dark:text-emerald-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  <Icon name={tab.icon} className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {getCurrentRank().charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {getCurrentRank()}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your current rank
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Weekly Goal Progress
                    </p>
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {totalActions}/5
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min((totalActions / 5) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Actions</h3>
                  <div className="space-y-3">
                    {actions.slice(0, 3).map((action) => (
                      <div
                        key={action.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-xl"
                      >
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                          <Icon
                            name="check"
                            className="w-6 h-6 text-emerald-600 dark:text-emerald-400"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{action.type}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {action.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {formatDate(action.timestamp)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            +{action.points}
                          </div>
                          <div className="text-xs text-gray-500">points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Latest Badges</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {earnedBadges.slice(0, 2).map((badge) => (
                      <div
                        key={badge.id}
                        className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl text-center"
                      >
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <h4 className="font-medium mb-1">{badge.name}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {badge.description}
                        </p>
                        <span
                          className={`text-xs font-medium ${getRarityColor(badge.rarity)}`}
                        >
                          {badge.rarity.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "actions" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Action History</h3>
                <div className="space-y-3">
                  {actions.map((action) => (
                    <div
                      key={action.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-xl"
                    >
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                        {action.photoUrl ? (
                          <img
                            src={action.photoUrl}
                            alt="Action proof"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Icon
                            name="camera"
                            className="w-6 h-6 text-gray-400"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{action.type}</h4>
                          {action.verified && (
                            <Icon
                              name="check"
                              className="w-4 h-4 text-emerald-500"
                            />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {action.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {formatDate(action.timestamp)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          +{action.points}
                        </div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "badges" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Badge Collection</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-xl text-center transition-all ${
                        badge.earned
                          ? "bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border-2 border-emerald-200 dark:border-emerald-800"
                          : "bg-gray-50 dark:bg-slate-700 opacity-50"
                      }`}
                    >
                      <div className="text-4xl mb-3">{badge.icon}</div>
                      <h4 className="font-medium mb-1">{badge.name}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {badge.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-medium ${getRarityColor(badge.rarity)}`}
                        >
                          {badge.rarity.toUpperCase()}
                        </span>
                        {badge.earned && badge.earnedDate && (
                          <span className="text-xs text-gray-500">
                            {formatDate(badge.earnedDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
