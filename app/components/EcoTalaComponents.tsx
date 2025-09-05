"use client";

import { type ReactNode, useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { useNotification } from "./NotificationSystem";
import { useEcoTalaContract } from "../../hooks/useEcoTalaContract";
import { NetworkStatus } from "./NetworkStatus";
import { LogActionModal } from "./LogActionModal";
import { RewardSystem } from "./RewardSystem";
import { ActionHistory } from "./ActionHistory";
import { WalletConnection } from "./WalletConnection";
import { PersonalDashboard } from "./PersonalDashboard";
import { CommunityStats } from "./CommunityStats";
import { ShareFeature } from "./ShareFeature";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  type = "button",
  icon,
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:pointer-events-none transform hover:scale-[1.02] active:scale-[0.98]";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg",
    secondary:
      "bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-md hover:shadow-lg",
    outline:
      "border-2 border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    ghost:
      "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400",
  };

  const sizeClasses = {
    sm: "text-xs px-3 py-2 rounded-xl",
    md: "text-sm px-5 py-3 rounded-xl",
    lg: "text-base px-6 py-4 rounded-xl",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="flex items-center mr-2">{icon}</span>}
      {children}
    </button>
  );
}

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

function Card({ title, children, className = "", onClick }: CardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden transition-all duration-300 ${className} ${onClick ? "cursor-pointer hover:scale-[1.02]" : ""}`}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
    >
      {title && (
        <div className="px-6 py-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-slate-800 dark:to-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center">
            <Icon name="leaf" size="sm" className="text-emerald-500 mr-2" />
            {title}
          </h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

type FeaturesProps = {
  setActiveTab: (tab: string) => void;
};

export function Features({ setActiveTab }: FeaturesProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="EcoTala Features">
        <div className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-start p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl">
              <div className="p-2 bg-emerald-500 rounded-full mr-4">
                <Icon name="camera" size="sm" className="text-white" />
              </div>
              <div>
                <h4 className="font-medium text-slate-800 dark:text-slate-200">
                  Photo Proof Actions
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Log eco-friendly actions with photo verification
                </p>
              </div>
            </div>

            <div className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
              <div className="p-2 bg-blue-500 rounded-full mr-4">
                <Icon name="star" size="sm" className="text-white" />
              </div>
              <div>
                <h4 className="font-medium text-slate-800 dark:text-slate-200">
                  NFT Rewards
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Earn points and NFT rewards on Base blockchain
                </p>
              </div>
            </div>

            <div className="flex items-start p-4 bg-gradient-to-r from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-800/20 rounded-xl">
              <div className="p-2 bg-amber-500 rounded-full mr-4">
                <Icon name="users" size="sm" className="text-white" />
              </div>
              <div>
                <h4 className="font-medium text-slate-800 dark:text-slate-200">
                  Community Impact
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Track personal and community environmental impact
                </p>
              </div>
            </div>

            <div className="flex items-start p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
              <div className="p-2 bg-purple-500 rounded-full mr-4">
                <Icon name="heart" size="sm" className="text-white" />
              </div>
              <div>
                <h4 className="font-medium text-slate-800 dark:text-slate-200">
                  Social Sharing
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Share achievements and inspire others
                </p>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setActiveTab("home")}
            className="w-full"
          >
            <Icon name="arrow-right" size="sm" className="mr-2 rotate-180" />
            Back to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}

type HomeProps = {
  setActiveTab: (tab: string) => void;
};

export function Home({ setActiveTab }: HomeProps) {
  const { address } = useAccount();
  const [showLogActionModal, setShowLogActionModal] = useState(false);
  const [showRewardSystem, setShowRewardSystem] = useState(false);
  const [showActionHistory, setShowActionHistory] = useState(false);
  const [showPersonalDashboard, setShowPersonalDashboard] = useState(false);
  const [showCommunityStats, setShowCommunityStats] = useState(false);
  const [showShareFeature, setShowShareFeature] = useState(false);

  if (!address) {
    return (
      <div className="space-y-6 animate-fade-in">
        <WelcomeCard />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <NetworkStatus />
      <UserDashboard
        setActiveTab={setActiveTab}
        onViewHistory={() => setShowActionHistory(true)}
      />
      <QuickActions
        onLogAction={() => setShowLogActionModal(true)}
        onViewRewards={() => setShowRewardSystem(true)}
        onViewDashboard={() => setShowPersonalDashboard(true)}
        onViewCommunity={() => setShowCommunityStats(true)}
        onShare={() => setShowShareFeature(true)}
      />

      {/* Modals */}
      {showLogActionModal && (
        <LogActionModal
          isOpen={showLogActionModal}
          onClose={() => setShowLogActionModal(false)}
          onSuccess={() => {
            // Refresh data after successful action
            window.location.reload();
          }}
        />
      )}

      {showRewardSystem && (
        <RewardSystem onClose={() => setShowRewardSystem(false)} />
      )}

      {showActionHistory && (
        <ActionHistory onClose={() => setShowActionHistory(false)} />
      )}

      {showPersonalDashboard && (
        <PersonalDashboard
          onClose={() => setShowPersonalDashboard(false)}
          onShare={() => {
            setShowPersonalDashboard(false);
            setShowShareFeature(true);
          }}
        />
      )}

      {showCommunityStats && (
        <CommunityStats onClose={() => setShowCommunityStats(false)} />
      )}

      {showShareFeature && (
        <ShareFeature onClose={() => setShowShareFeature(false)} />
      )}
    </div>
  );
}

type IconProps = {
  name:
    | "heart"
    | "star"
    | "check"
    | "plus"
    | "arrow-right"
    | "leaf"
    | "recycle"
    | "camera"
    | "trophy"
    | "users";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function Icon({ name, size = "md", className = "" }: IconProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const icons = {
    heart: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Heart</title>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    star: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Star</title>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    check: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Check</title>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    plus: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Plus</title>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    "arrow-right": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Arrow Right</title>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    ),
    leaf: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Leaf</title>
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    ),
    recycle: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Recycle</title>
        <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
        <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
        <path d="m14 16-3 3 3 3" />
        <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
        <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
        <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
      </svg>
    ),
    camera: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Camera</title>
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
        <circle cx="12" cy="13" r="3" />
      </svg>
    ),
    trophy: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Trophy</title>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55.47.98.97 1.21C12.04 18.75 14 20.24 14 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
    users: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Users</title>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="m22 21-2-2" />
        <path d="M22 12c0 5.5-4.5 10-10 10s-10-4.5-10-10S6.5 2 12 2s10 4.5 10 10Z" />
        <circle cx="10" cy="8" r="3" />
        <path d="M17 16h5l-1.5-3" />
      </svg>
    ),
  };

  return (
    <span className={`inline-block ${sizeClasses[size]} ${className}`}>
      {icons[name]}
    </span>
  );
}

// Welcome Card for new users (not logged in)
function WelcomeCard() {
  return (
    <Card>
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full shadow-lg">
            <Icon name="leaf" size="lg" className="text-white" />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
            Welcome to EcoTala! 🌿
          </h1>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Join thousands of Filipinos making our country greener. Log
            eco-friendly actions, earn points, and track community impact on
            Base blockchain.
          </p>
        </div>
        <div className="flex items-center justify-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-xl">
          <Icon name="users" size="sm" className="text-emerald-500" />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Join the movement for a greener Philippines! 🇵🇭
          </span>
        </div>
        <div className="pt-2">
          <WalletConnection />
        </div>
      </div>
    </Card>
  );
}

// User Dashboard for logged in users
type UserDashboardProps = {
  setActiveTab: (tab: string) => void;
  onViewHistory?: () => void;
};

function UserDashboard({ setActiveTab, onViewHistory }: UserDashboardProps) {
  const { userStats, globalStats } = useEcoTalaContract();

  // Default values while loading
  const displayStats = {
    totalPoints: userStats?.points || 0,
    actionsLogged: userStats?.actionCount || 0,
    rank: userStats?.rank || "Eco Beginner",
    weeklyGoal: 5,
    weeklyProgress: Math.min(userStats?.actionCount || 0, 5), // Simple weekly progress
  };

  return (
    <Card title="Your Eco Impact">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-xl border border-emerald-200 dark:border-emerald-700">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {displayStats.totalPoints}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Green Points
            </div>
          </div>
          <div
            className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl border border-blue-200 dark:border-blue-700 cursor-pointer hover:scale-105 transition-transform"
            onClick={onViewHistory}
          >
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {displayStats.actionsLogged}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Actions Logged
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500 rounded-full">
              <Icon name="trophy" size="sm" className="text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {displayStats.rank}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Your current rank
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("features")}
            className="text-amber-600 dark:text-amber-400"
          >
            View Features
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Weekly Goal Progress
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {displayStats.weeklyProgress}/{displayStats.weeklyGoal}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
              style={{
                width: `${(displayStats.weeklyProgress / displayStats.weeklyGoal) * 100}%`,
              }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {globalStats && (
          <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
            <h4 className="text-sm font-semibold mb-4 text-slate-800 dark:text-slate-200 flex items-center">
              <Icon name="users" size="sm" className="text-emerald-500 mr-2" />
              Community Impact
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {globalStats.totalActions}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Total Actions
                </div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/20 rounded-lg">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {globalStats.totalUsers}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Eco Warriors
                </div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-50 dark:from-purple-900/20 dark:to-purple-900/20 rounded-lg">
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {globalStats.totalPointsAwarded}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Points Earned
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// Quick Actions for logged in users
type QuickActionsProps = {
  onLogAction?: () => void;
  onViewRewards?: () => void;
  onViewDashboard?: () => void;
  onViewCommunity?: () => void;
  onShare?: () => void;
};

function QuickActions({
  onLogAction,
  onViewRewards,
  onViewDashboard,
  onViewCommunity,
  onShare,
}: QuickActionsProps) {
  const sendNotification = useNotification();

  const handleLogAction = useCallback(async () => {
    if (onLogAction) {
      onLogAction();
    } else {
      // Fallback notification for demo
      sendNotification({
        title: "Ready to Log Action! 📸",
        body: "Photo upload and blockchain logging coming soon!",
        type: "info",
      });
    }
  }, [sendNotification, onLogAction]);

  const handleViewRewards = useCallback(async () => {
    if (onViewRewards) {
      onViewRewards();
    } else {
      // Fallback notification
      sendNotification({
        title: "Rewards System! 🏆",
        body: "Check your achievements and NFT rewards!",
        type: "info",
      });
    }
  }, [sendNotification, onViewRewards]);

  const handleViewDashboard = useCallback(async () => {
    if (onViewDashboard) {
      onViewDashboard();
    } else {
      sendNotification({
        title: "Personal Dashboard! 📊",
        body: "Track your eco journey and progress!",
        type: "info",
      });
    }
  }, [sendNotification, onViewDashboard]);

  const handleViewCommunity = useCallback(async () => {
    if (onViewCommunity) {
      onViewCommunity();
    } else {
      sendNotification({
        title: "Community Impact! 🌍",
        body: "See how Filipinos are changing the world together!",
        type: "info",
      });
    }
  }, [sendNotification, onViewCommunity]);

  const handleShare = useCallback(async () => {
    if (onShare) {
      onShare();
    } else {
      sendNotification({
        title: "Share Feature! 📱",
        body: "Share your eco achievements with friends!",
        type: "info",
      });
    }
  }, [sendNotification, onShare]);

  return (
    <Card title="Quick Actions">
      <div className="space-y-4">
        {/* Top Row - Primary Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="primary"
            className="flex flex-col items-center p-6 h-auto space-y-2 shadow-lg hover:shadow-xl"
            onClick={handleLogAction}
          >
            <div className="p-3 bg-white/20 rounded-full">
              <Icon name="camera" size="md" className="text-white" />
            </div>
            <span className="text-sm font-semibold">Log Action</span>
            <span className="text-xs opacity-90">Take a photo</span>
          </Button>

          <Button
            variant="secondary"
            className="flex flex-col items-center p-6 h-auto space-y-2 shadow-lg hover:shadow-xl"
            onClick={handleViewRewards}
          >
            <div className="p-3 bg-white/20 rounded-full">
              <Icon name="star" size="md" className="text-white" />
            </div>
            <span className="text-sm font-semibold">Rewards</span>
            <span className="text-xs opacity-90">View prizes</span>
          </Button>
        </div>

        {/* Bottom Row - Secondary Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto space-y-1 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            onClick={handleViewDashboard}
          >
            <Icon name="trophy" size="sm" className="text-emerald-500" />
            <span className="text-xs font-medium">Dashboard</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto space-y-1 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            onClick={handleViewCommunity}
          >
            <Icon name="users" size="sm" className="text-blue-500" />
            <span className="text-xs font-medium">Community</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto space-y-1 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            onClick={handleShare}
          >
            <Icon name="heart" size="sm" className="text-purple-500" />
            <span className="text-xs font-medium">Share</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
