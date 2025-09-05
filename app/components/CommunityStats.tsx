"use client";

import { useState, useEffect } from "react";
import { useEcoTalaContract } from "../../hooks/useEcoTalaContract";
import { Button, Icon } from "./EcoTalaComponents";

type CommunityStatsProps = {
  onClose: () => void;
};

type ImpactMetric = {
  id: string;
  title: string;
  value: number;
  unit: string;
  icon: string;
  description: string;
  trend: "up" | "down" | "stable";
  percentage: number;
};

type RegionData = {
  region: string;
  actions: number;
  users: number;
  points: number;
  topAction: string;
};

type TimelineData = {
  date: string;
  actions: number;
  users: number;
};

export function CommunityStats({ onClose }: CommunityStatsProps) {
  const { globalStats } = useEcoTalaContract();
  const [activeTab, setActiveTab] = useState<"impact" | "regions" | "timeline">(
    "impact",
  );
  const [loading, setLoading] = useState(true);
  const [impactMetrics, setImpactMetrics] = useState<ImpactMetric[]>([]);
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);

  useEffect(() => {
    const loadCommunityData = async () => {
      setLoading(true);

      // Simulate API call - replace with real analytics data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock environmental impact metrics
      const mockMetrics: ImpactMetric[] = [
        {
          id: "waste-diverted",
          title: "Waste Diverted",
          value: 2547,
          unit: "kg",
          icon: "♻️",
          description:
            "Total waste properly segregated and diverted from landfills",
          trend: "up",
          percentage: 23.5,
        },
        {
          id: "trees-planted",
          title: "Trees Planted",
          value: 1289,
          unit: "trees",
          icon: "🌳",
          description: "Native trees planted across the Philippines",
          trend: "up",
          percentage: 45.2,
        },
        {
          id: "carbon-offset",
          title: "Carbon Offset",
          value: 12.3,
          unit: "tons CO₂",
          icon: "🌍",
          description: "Estimated carbon emissions offset by community actions",
          trend: "up",
          percentage: 18.7,
        },
        {
          id: "plastic-bottles",
          title: "Plastic Bottles",
          value: 8924,
          unit: "bottles",
          icon: "🥤",
          description: "Plastic bottles collected and properly recycled",
          trend: "up",
          percentage: 31.4,
        },
        {
          id: "cleanup-areas",
          title: "Areas Cleaned",
          value: 47,
          unit: "locations",
          icon: "🏖️",
          description:
            "Parks, beaches, and communities cleaned by eco warriors",
          trend: "stable",
          percentage: 0,
        },
        {
          id: "water-saved",
          title: "Water Saved",
          value: 15680,
          unit: "liters",
          icon: "💧",
          description: "Water conservation through sustainable practices",
          trend: "up",
          percentage: 12.8,
        },
      ];

      // Mock regional data
      const mockRegions: RegionData[] = [
        {
          region: "Metro Manila",
          actions: 2847,
          users: 1245,
          points: 28470,
          topAction: "Waste Segregation",
        },
        {
          region: "Cebu",
          actions: 1523,
          users: 687,
          points: 15230,
          topAction: "Beach Cleanup",
        },
        {
          region: "Davao",
          actions: 1287,
          users: 543,
          points: 12870,
          topAction: "Tree Planting",
        },
        {
          region: "Iloilo",
          actions: 892,
          users: 398,
          points: 8920,
          topAction: "Plastic Collection",
        },
        {
          region: "Baguio",
          actions: 654,
          users: 287,
          points: 6540,
          topAction: "Mountain Cleanup",
        },
      ];

      // Mock timeline data (last 7 days)
      const mockTimeline: TimelineData[] = [
        { date: "Sep 5", actions: 287, users: 156 },
        { date: "Sep 4", actions: 234, users: 143 },
        { date: "Sep 3", actions: 198, users: 128 },
        { date: "Sep 2", actions: 167, users: 98 },
        { date: "Sep 1", actions: 145, users: 87 },
        { date: "Aug 31", actions: 123, users: 76 },
        { date: "Aug 30", actions: 98, users: 54 },
      ];

      setImpactMetrics(mockMetrics);
      setRegionData(mockRegions);
      setTimelineData(mockTimeline);
      setLoading(false);
    };

    loadCommunityData();
  }, []);

  const totalUsers =
    globalStats?.totalUsers ||
    regionData.reduce((sum, region) => sum + region.users, 0);
  const totalActions =
    globalStats?.totalActions ||
    regionData.reduce((sum, region) => sum + region.actions, 0);
  const totalPoints =
    globalStats?.totalPointsAwarded ||
    regionData.reduce((sum, region) => sum + region.points, 0);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "📈";
      case "down":
        return "📉";
      case "stable":
        return "➡️";
      default:
        return "📊";
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      case "stable":
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
              Loading community impact...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--app-background)] rounded-xl p-6 max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[var(--app-foreground)] flex items-center">
            <Icon name="users" className="mr-3 text-[var(--app-accent)]" />
            Community Impact - Bayanihan para sa Kalikasan
          </h2>
          <Button variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="text-center p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white">
            <div className="text-4xl font-bold">
              {totalUsers.toLocaleString()}
            </div>
            <div className="text-green-100">Eco Warriors</div>
            <div className="text-sm text-green-200 mt-1">
              Filipinos fighting climate change
            </div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white">
            <div className="text-4xl font-bold">
              {totalActions.toLocaleString()}
            </div>
            <div className="text-blue-100">Actions Completed</div>
            <div className="text-sm text-blue-200 mt-1">
              Verified environmental impact
            </div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white">
            <div className="text-4xl font-bold">
              {totalPoints.toLocaleString()}
            </div>
            <div className="text-purple-100">Points Earned</div>
            <div className="text-sm text-purple-200 mt-1">
              Blockchain-verified rewards
            </div>
          </div>
        </div>

        {/* Inspirational Message */}
        <div className="bg-gradient-to-r from-[var(--app-accent-light)] to-[var(--app-accent)] p-4 rounded-lg mb-6">
          <p className="text-center text-[var(--app-background)] font-medium">
            🇵🇭 &ldquo;Sa pamamagitan ng bayanihan, nagiging mas malinis at mas
            luntian ang ating bansa!&rdquo; 🌿
          </p>
          <p className="text-center text-[var(--app-background)] text-sm opacity-90 mt-1">
            Together, we&apos;re making the Philippines cleaner and greener!
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-4 bg-[var(--app-card-bg)] p-1 rounded-lg">
          {[
            {
              id: "impact" as const,
              label: "Environmental Impact",
              icon: "leaf" as const,
            },
            {
              id: "regions" as const,
              label: "Regional Leaderboard",
              icon: "trophy" as const,
            },
            {
              id: "timeline" as const,
              label: "Activity Timeline",
              icon: "star" as const,
            },
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
          {activeTab === "impact" && (
            <div className="grid grid-cols-2 gap-4">
              {impactMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className="p-4 bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{metric.icon}</div>
                      <div>
                        <div className="font-semibold text-[var(--app-foreground)]">
                          {metric.title}
                        </div>
                        <div className="text-xs text-[var(--app-foreground-muted)]">
                          {metric.description}
                        </div>
                      </div>
                    </div>
                    {metric.trend !== "stable" && (
                      <div
                        className={`flex items-center space-x-1 text-xs ${getTrendColor(metric.trend)}`}
                      >
                        <span>{getTrendIcon(metric.trend)}</span>
                        <span>{metric.percentage}%</span>
                      </div>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-[var(--app-accent)]">
                    {metric.value.toLocaleString()}
                    <span className="text-sm font-normal text-[var(--app-foreground-muted)] ml-1">
                      {metric.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "regions" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[var(--app-foreground)]">
                Top Performing Regions
              </h3>
              <div className="space-y-3">
                {regionData.map((region, index) => (
                  <div
                    key={region.region}
                    className="flex items-center space-x-4 p-4 bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)]"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--app-accent)] text-[var(--app-background)] font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-[var(--app-foreground)]">
                        {region.region}
                      </div>
                      <div className="text-sm text-[var(--app-foreground-muted)]">
                        Top Action: {region.topAction}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-[var(--app-accent)]">
                        {region.actions}
                      </div>
                      <div className="text-xs text-[var(--app-foreground-muted)]">
                        Actions
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-[var(--app-accent)]">
                        {region.users}
                      </div>
                      <div className="text-xs text-[var(--app-foreground-muted)]">
                        Users
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-[var(--app-accent)]">
                        {region.points.toLocaleString()}
                      </div>
                      <div className="text-xs text-[var(--app-foreground-muted)]">
                        Points
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-gray-800 mb-2">
                  🏆 Regional Competition
                </h4>
                <p className="text-sm text-gray-700">
                  Metro Manila leads with {regionData[0]?.actions} actions!
                  Other regions are catching up fast. Every action counts
                  towards making the Philippines the cleanest archipelago in
                  Southeast Asia! 🇵🇭
                </p>
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[var(--app-foreground)]">
                Community Activity (Last 7 Days)
              </h3>

              {/* Simple Chart */}
              <div className="space-y-3">
                {timelineData.map((day) => {
                  const maxActions = Math.max(
                    ...timelineData.map((d) => d.actions),
                  );
                  const actionWidth = (day.actions / maxActions) * 100;
                  const maxUsers = Math.max(
                    ...timelineData.map((d) => d.users),
                  );
                  const userWidth = (day.users / maxUsers) * 100;

                  return (
                    <div
                      key={day.date}
                      className="p-3 bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-[var(--app-foreground)]">
                          {day.date}
                        </span>
                        <div className="flex space-x-4 text-sm">
                          <span className="text-[var(--app-accent)]">
                            {day.actions} actions
                          </span>
                          <span className="text-[var(--app-foreground-muted)]">
                            {day.users} users
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-[var(--app-foreground-muted)] w-12">
                            Actions
                          </span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[var(--app-accent)] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${actionWidth}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-[var(--app-foreground-muted)] w-12">
                            Users
                          </span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${userWidth}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-200">
                <h4 className="font-semibold text-gray-800 mb-2">
                  📊 Growth Insights
                </h4>
                <p className="text-sm text-gray-700">
                  Community activity is growing! We&apos;re seeing a 23%
                  increase in daily eco-actions. The momentum is building as
                  more Filipinos join the environmental revolution! 🚀
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
