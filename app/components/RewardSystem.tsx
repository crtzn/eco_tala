"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useNotification } from "./NotificationSystem";
import { Button, Icon } from "./EcoTalaComponents";
import { useEcoTalaContract } from "../../hooks/useEcoTalaContract";

type RewardSystemProps = {
  onClose: () => void;
};

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  currentProgress: number;
  isUnlocked: boolean;
  reward: string;
};

type NFTReward = {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  unlockedAt?: Date;
};

export function RewardSystem({ onClose }: RewardSystemProps) {
  const { address } = useAccount();
  const { userStats } = useEcoTalaContract();
  const sendNotification = useNotification();

  const [activeTab, setActiveTab] = useState<
    "overview" | "achievements" | "nfts" | "leaderboard"
  >("overview");
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [nftRewards, setNftRewards] = useState<NFTReward[]>([]);

  // Initialize achievements based on user progress
  useEffect(() => {
    if (!userStats) return;

    const achievementsList: Achievement[] = [
      {
        id: "first_action",
        title: "Eco Warrior",
        description: "Log your first eco-action",
        icon: "🌱",
        requirement: 1,
        currentProgress: userStats.actionCount,
        isUnlocked: userStats.actionCount >= 1,
        reward: "50 Bonus Points",
      },
      {
        id: "ten_actions",
        title: "Green Guardian",
        description: "Complete 10 eco-actions",
        icon: "🛡️",
        requirement: 10,
        currentProgress: userStats.actionCount,
        isUnlocked: userStats.actionCount >= 10,
        reward: "Eco Guardian NFT",
      },
      {
        id: "hundred_points",
        title: "Point Collector",
        description: "Earn 100 points",
        icon: "💎",
        requirement: 100,
        currentProgress: userStats.points,
        isUnlocked: userStats.points >= 100,
        reward: "Diamond NFT",
      },
      {
        id: "weekly_streak",
        title: "Weekly Warrior",
        description: "Log actions for 7 consecutive days",
        icon: "🔥",
        requirement: 7,
        currentProgress: Math.min(userStats.actionCount, 7), // Simplified for demo
        isUnlocked: userStats.actionCount >= 7,
        reward: "Streak Master NFT",
      },
      {
        id: "recycle_master",
        title: "Recycle Master",
        description: "Complete 25 recycling actions",
        icon: "♻️",
        requirement: 25,
        currentProgress: Math.min(userStats.actionCount, 25), // Simplified for demo
        isUnlocked: userStats.actionCount >= 25,
        reward: "Recycle Champion NFT",
      },
    ];

    setAchievements(achievementsList);
  }, [userStats]);

  // Initialize NFT rewards
  useEffect(() => {
    if (!userStats) return;

    const nftList: NFTReward[] = [
      {
        id: "starter_nft",
        name: "Eco Starter",
        description: "Welcome to the EcoTala community!",
        image: "🌿",
        rarity: "Common",
        unlockedAt: userStats.actionCount >= 1 ? new Date() : undefined,
      },
      {
        id: "guardian_nft",
        name: "Green Guardian",
        description: "Protector of the environment",
        image: "🛡️",
        rarity: "Rare",
        unlockedAt: userStats.actionCount >= 10 ? new Date() : undefined,
      },
      {
        id: "diamond_nft",
        name: "Diamond Eco Warrior",
        description: "A true champion of sustainability",
        image: "💎",
        rarity: "Epic",
        unlockedAt: userStats.points >= 100 ? new Date() : undefined,
      },
      {
        id: "champion_nft",
        name: "Ultimate Eco Champion",
        description: "The highest honor in EcoTala",
        image: "👑",
        rarity: "Legendary",
        unlockedAt: userStats.points >= 500 ? new Date() : undefined,
      },
    ];

    setNftRewards(nftList);
  }, [userStats]);

  const handleClaimReward = async (achievementId: string) => {
    const achievement = achievements.find((a) => a.id === achievementId);
    if (!achievement || !achievement.isUnlocked) return;

    await sendNotification({
      title: "🎉 Reward Claimed!",
      body: `You've claimed: ${achievement.reward}`,
    });
  };

  const getProgressPercentage = (
    current: number,
    requirement: number,
  ): number => {
    return Math.min((current / requirement) * 100, 100);
  };

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case "Common":
        return "text-gray-500";
      case "Rare":
        return "text-blue-500";
      case "Epic":
        return "text-purple-500";
      case "Legendary":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  if (!address) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[var(--app-card-bg)] rounded-xl shadow-lg border border-[var(--app-card-border)] w-full max-w-md p-6">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-[var(--app-foreground)]">
              Connect Wallet
            </h2>
            <p className="text-[var(--app-foreground-muted)]">
              Please connect your wallet to view rewards
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--app-card-bg)] rounded-xl shadow-2xl border border-[var(--app-card-border)] w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--app-card-border)]">
          <h2 className="text-xl font-bold text-[var(--app-foreground)]">
            🏆 Reward System
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-[var(--app-card-border)]">
          <div className="flex overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: "star" as const },
              {
                id: "achievements",
                label: "Achievements",
                icon: "trophy" as const,
              },
              { id: "nfts", label: "NFTs", icon: "heart" as const },
              {
                id: "leaderboard",
                label: "Leaderboard",
                icon: "users" as const,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[var(--app-accent)] text-[var(--app-accent)]"
                    : "border-transparent text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
                }`}
              >
                <Icon name={tab.icon} size="sm" />
                <span className="text-sm font-medium whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* User Stats Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-[var(--app-accent-light)] rounded-lg">
                  <div className="text-2xl font-bold text-[var(--app-accent)]">
                    {userStats?.points || 0}
                  </div>
                  <div className="text-sm text-[var(--app-foreground-muted)]">
                    Total Points
                  </div>
                </div>
                <div className="text-center p-4 bg-[var(--app-accent-light)] rounded-lg">
                  <div className="text-2xl font-bold text-[var(--app-accent)]">
                    {userStats?.actionCount || 0}
                  </div>
                  <div className="text-sm text-[var(--app-foreground-muted)]">
                    Actions Logged
                  </div>
                </div>
                <div className="text-center p-4 bg-[var(--app-accent-light)] rounded-lg">
                  <div className="text-2xl font-bold text-[var(--app-accent)]">
                    {achievements.filter((a) => a.isUnlocked).length}
                  </div>
                  <div className="text-sm text-[var(--app-foreground-muted)]">
                    Achievements
                  </div>
                </div>
                <div className="text-center p-4 bg-[var(--app-accent-light)] rounded-lg">
                  <div className="text-2xl font-bold text-[var(--app-accent)]">
                    {nftRewards.filter((nft) => nft.unlockedAt).length}
                  </div>
                  <div className="text-sm text-[var(--app-foreground-muted)]">
                    NFTs Earned
                  </div>
                </div>
              </div>

              {/* Recent Achievements */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--app-foreground)] mb-4">
                  Recent Achievements
                </h3>
                <div className="space-y-3">
                  {achievements
                    .filter((a) => a.isUnlocked)
                    .slice(0, 3)
                    .map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-center space-x-3 p-3 bg-[var(--app-accent-light)] rounded-lg"
                      >
                        <span className="text-2xl">{achievement.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-[var(--app-foreground)]">
                            {achievement.title}
                          </div>
                          <div className="text-sm text-[var(--app-foreground-muted)]">
                            {achievement.description}
                          </div>
                        </div>
                        <Icon
                          name="check"
                          size="sm"
                          className="text-green-500"
                        />
                      </div>
                    ))}
                </div>
              </div>

              {/* Next Milestone */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--app-foreground)] mb-4">
                  Next Milestone
                </h3>
                {(() => {
                  const nextAchievement = achievements.find(
                    (a) => !a.isUnlocked,
                  );
                  if (!nextAchievement) {
                    return (
                      <div className="text-center p-6 bg-[var(--app-accent-light)] rounded-lg">
                        <span className="text-2xl">🎉</span>
                        <div className="mt-2 font-medium text-[var(--app-foreground)]">
                          All achievements unlocked!
                        </div>
                        <div className="text-sm text-[var(--app-foreground-muted)]">
                          You&apos;re an Eco Champion!
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="p-4 border border-[var(--app-card-border)] rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">{nextAchievement.icon}</span>
                        <div>
                          <div className="font-medium text-[var(--app-foreground)]">
                            {nextAchievement.title}
                          </div>
                          <div className="text-sm text-[var(--app-foreground-muted)]">
                            {nextAchievement.description}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {nextAchievement.currentProgress}/
                            {nextAchievement.requirement}
                          </span>
                        </div>
                        <div className="w-full bg-[var(--app-gray)] rounded-full h-2">
                          <div
                            className="bg-[var(--app-accent)] h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${getProgressPercentage(nextAchievement.currentProgress, nextAchievement.requirement)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border ${
                    achievement.isUnlocked
                      ? "border-green-500 bg-green-50/10"
                      : "border-[var(--app-card-border)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <div className="font-medium text-[var(--app-foreground)]">
                          {achievement.title}
                        </div>
                        <div className="text-sm text-[var(--app-foreground-muted)]">
                          {achievement.description}
                        </div>
                      </div>
                    </div>
                    {achievement.isUnlocked ? (
                      <Button
                        size="sm"
                        onClick={() => handleClaimReward(achievement.id)}
                      >
                        Claim
                      </Button>
                    ) : (
                      <span className="text-xs text-[var(--app-foreground-muted)] bg-[var(--app-gray)] px-2 py-1 rounded">
                        Locked
                      </span>
                    )}
                  </div>

                  {!achievement.isUnlocked && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {achievement.currentProgress}/
                          {achievement.requirement}
                        </span>
                      </div>
                      <div className="w-full bg-[var(--app-gray)] rounded-full h-2">
                        <div
                          className="bg-[var(--app-accent)] h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${getProgressPercentage(achievement.currentProgress, achievement.requirement)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-2 text-xs text-[var(--app-foreground-muted)]">
                    Reward: {achievement.reward}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* NFTs Tab */}
          {activeTab === "nfts" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nftRewards.map((nft) => (
                <div
                  key={nft.id}
                  className={`p-4 rounded-lg border ${
                    nft.unlockedAt
                      ? "border-[var(--app-accent)] bg-[var(--app-accent-light)]"
                      : "border-[var(--app-card-border)] opacity-50"
                  }`}
                >
                  <div className="text-center space-y-3">
                    <div className="text-4xl">{nft.image}</div>
                    <div>
                      <div className="font-medium text-[var(--app-foreground)]">
                        {nft.name}
                      </div>
                      <div
                        className={`text-sm font-medium ${getRarityColor(nft.rarity)}`}
                      >
                        {nft.rarity}
                      </div>
                      <div className="text-sm text-[var(--app-foreground-muted)] mt-1">
                        {nft.description}
                      </div>
                    </div>
                    {nft.unlockedAt ? (
                      <div className="text-xs text-green-600">
                        Unlocked {nft.unlockedAt.toLocaleDateString()}
                      </div>
                    ) : (
                      <div className="text-xs text-[var(--app-foreground-muted)]">
                        Not yet unlocked
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === "leaderboard" && (
            <div className="space-y-4">
              <div className="text-center p-6 bg-[var(--app-accent-light)] rounded-lg">
                <Icon
                  name="trophy"
                  size="lg"
                  className="text-[var(--app-accent)] mx-auto mb-2"
                />
                <div className="font-medium text-[var(--app-foreground)]">
                  Your Rank: {userStats?.rank || "Eco Beginner"}
                </div>
                <div className="text-sm text-[var(--app-foreground-muted)]">
                  {userStats?.points || 0} points
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[var(--app-foreground)]">
                  Top Eco Warriors
                </h3>
                {/* Demo leaderboard */}
                {[
                  { rank: 1, name: "EcoChampion", points: 2500, badge: "🥇" },
                  { rank: 2, name: "GreenWarrior", points: 1800, badge: "🥈" },
                  { rank: 3, name: "PlantMaster", points: 1200, badge: "🥉" },
                  {
                    rank: 4,
                    name: address?.slice(0, 8) + "..." || "You",
                    points: userStats?.points || 0,
                    badge: "🌱",
                  },
                ].map((user) => (
                  <div
                    key={user.rank}
                    className="flex items-center justify-between p-3 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{user.badge}</span>
                      <div>
                        <div className="font-medium text-[var(--app-foreground)]">
                          #{user.rank} {user.name}
                        </div>
                        <div className="text-sm text-[var(--app-foreground-muted)]">
                          {user.points} points
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
