"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useReadContract } from "wagmi";
import { ECOTALA_CONTRACT } from "../lib/contract-utils";
import { Address } from "viem";

export type UserStats = {
  points: number;
  actionCount: number;
  rank: string;
};

export type GlobalStats = {
  totalActions: number;
  totalUsers: number;
  totalPointsAwarded: number;
};

export type EcoAction = {
  actionType: string;
  photoHash: string;
  points: number;
  timestamp: Date;
  verified: boolean;
};

export function useEcoTalaContract() {
  const { address } = useAccount();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [userActions, setUserActions] = useState<EcoAction[]>([]);
  const [loading, setLoading] = useState(false);

  // Read user points
  const { data: userPoints } = useReadContract({
    address: ECOTALA_CONTRACT.address,
    abi: ECOTALA_CONTRACT.abi,
    functionName: "getUserPoints",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read user action count
  const { data: userActionCount } = useReadContract({
    address: ECOTALA_CONTRACT.address,
    abi: ECOTALA_CONTRACT.abi,
    functionName: "getUserActionCount",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read global stats
  const { data: globalStatsData } = useReadContract({
    address: ECOTALA_CONTRACT.address,
    abi: ECOTALA_CONTRACT.abi,
    functionName: "getGlobalStats",
  });

  // Calculate user rank based on points
  const calculateRank = (points: number): string => {
    if (points >= 500) return "Eco Champion";
    if (points >= 200) return "Eco Warrior";
    if (points >= 100) return "Eco Guardian";
    if (points >= 50) return "Eco Friend";
    return "Eco Beginner";
  };

  // Update user stats when data changes
  useEffect(() => {
    if (userPoints !== undefined && userActionCount !== undefined) {
      setUserStats({
        points: Number(userPoints),
        actionCount: Number(userActionCount),
        rank: calculateRank(Number(userPoints)),
      });
    }
  }, [userPoints, userActionCount]);

  // Update global stats when data changes
  useEffect(() => {
    if (globalStatsData && Array.isArray(globalStatsData)) {
      setGlobalStats({
        totalActions: Number(globalStatsData[0]),
        totalUsers: Number(globalStatsData[1]),
        totalPointsAwarded: Number(globalStatsData[2]),
      });
    }
  }, [globalStatsData]);

  // Fetch user actions
  const fetchUserActions = useCallback(async () => {
    if (!address || !userActionCount) return;

    setLoading(true);
    try {
      const actions: EcoAction[] = [];
      const count = Number(userActionCount);

      // For demo purposes, we'll create mock data
      // In production, you'd make actual contract calls
      for (let i = 0; i < Math.min(count, 10); i++) {
        // Limit to last 10 actions
        actions.push({
          actionType: "Recycle Plastic",
          photoHash: `demo_photo_${i}`,
          points: 10,
          timestamp: new Date(Date.now() - i * 86400000), // i days ago
          verified: true,
        });
      }

      setUserActions(actions);
    } catch (error) {
      console.error("Error fetching user actions:", error);
    } finally {
      setLoading(false);
    }
  }, [address, userActionCount]);

  // Fetch actions when user or action count changes
  useEffect(() => {
    if (address && userActionCount) {
      fetchUserActions();
    }
  }, [address, userActionCount, fetchUserActions]);

  return {
    userStats,
    globalStats,
    userActions,
    loading,
    contractAddress: ECOTALA_CONTRACT.address,
    isConnected: !!address,
    refetchUserActions: fetchUserActions,
  };
}
